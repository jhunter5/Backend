import { RequestHandler } from "express";
import { LandlordModel } from "../../models/users/landlord";
import createHttpError from "http-errors";

import { uploadFileS3 } from "../../utils/S3"; // Asegúrate de importar correctamente la función de subida

export const createLandlord: RequestHandler = async (req, res, next) => {
  try {
    const {
      id,
      firstName,
      lastName,
      phone,
      email,
      avgRating,
      authID,
      gender,
    } = req.body;
    const avatarFile = req.files?.files; // La imagen enviada en el campo `files`
    // Verificar si el landlord ya existe
    const existingLandlord = await LandlordModel.findOne({ authID }).exec();
    if (existingLandlord) {
      res.status(409).json({ message: "ID Already Taken" });
      return;
    }

    // Subir la imagen del avatar a S3
    let avatarUrl = null;
    if (avatarFile) {
      avatarUrl = await uploadFileS3(avatarFile); // Subir archivo y obtener URL
    } else {
      avatarUrl = ""; // Avatar predeterminado
    }

    // Crear el nuevo landlord
    const newLandlord = await LandlordModel.create({
      id,
      firstName,
      lastName,
      phone,
      email,
      avgRating,
      authID,
      gender,
      avatar: avatarUrl, // Asignar el enlace del avatar
    });

    res.status(201).json(newLandlord);
  } catch (error) {
    if ((error as any).name === "ValidationError") {
      // Manejo de errores de validación de Mongoose
      const validationErrors = Object.values((error as any).errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
      return;
    }

    if ((error as any).code === 11000) {
      // Manejo de errores de clave duplicada
      const duplicateKey = Object.keys((error as any).keyPattern).join(", ");
      res.status(409).json({
        message: "Duplicate key error",
        error: `The field(s) ${duplicateKey} must be unique.`,
        details: (error as any).keyValue,
      });
      return;
    }

    // Otros errores de MongoDB
    if ((error as any).name === "MongoServerError") {
      res.status(500).json({
        message: "MongoDB Server Error",
        error: (error as any).errmsg || "An unknown MongoDB error occurred.",
        details: error,
      });
      return;
    }

    // Registrar otros errores para depuración
    console.error(error);

    // Pasar el error a otros middlewares
    next(error);
  }
};

export const updateLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phone,
      email,
      numberOfProperties,
      avgRating,
      fulfillmentPercentage, // Nuevo atributo
    } = req.body;
    const avatarFile = req.files?.file; // La imagen enviada en el campo `file`

    // Subir una nueva imagen si se proporciona
    let avatarUrl = null;
    if (avatarFile) {
      avatarUrl = await uploadFileS3(avatarFile);
    }

    const updatedLandlord = await LandlordModel.findOneAndUpdate(
      { authID: id },
      {
        firstName,
        lastName,
        phone,
        email,
        numberOfProperties,
        avgRating,
        ...(avatarUrl && { avatar: avatarUrl }), // Actualizar avatar solo si se proporciona
        updatedAt: new Date(),
      },
      { new: true }
    ).exec();

    if (!updatedLandlord) {
      throw createHttpError(404, `Landlord with ID ${id} not found`);
    }

    res.status(200).json(updatedLandlord);
  } catch (error) {
    next(error);
  }
};


export const deleteLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedLandlord = await LandlordModel.findOneAndDelete({ authID: id }).exec();
    if (!deletedLandlord) {
      throw createHttpError(404, `Landlord with ID ${id} not found`);
    }

    res.status(200).json("Landlord successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const landlord = await LandlordModel.findOne({ authID: id }).exec();
    if (!landlord) {
      throw createHttpError(404, `Landlord with ID ${id} not found`);
    }

    res.status(200).json(landlord);
  } catch (error) {
    next(error);
  }
};

export const showLandlords: RequestHandler = async (req, res, next) => {
  try {
    const landlords = await LandlordModel.find().exec();
    if (!landlords || landlords.length === 0) {
      throw createHttpError(404, "No landlords found");
    }

    res.status(200).json(landlords);
  } catch (error) {
    next(error);
  }
};

export const getActiveTenantsByLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tenants = await LandlordModel.aggregate().match({ authID: id })
      .lookup({ from: "properties", localField: "authID", foreignField: "landlordAuthID", as: "properties" })
      .unwind("$properties")
      .lookup({ from: "contracts", localField: "properties._id", foreignField: "propertyId", as: "contracts" })
      .addFields({
      // Filtrar solo los contratos activos
      contracts: {
        $filter: {
        input: "$contracts",
        as: "contract",
        cond: {
          $and: [
          { $lte: ["$$contract.startDate", new Date().toISOString()] },
          { $gte: ["$$contract.endDate", new Date().toISOString()] },
          ],
        },
        },
      },
      })
      .unwind("$contracts")
      .addFields({ "contracts.tenantObjectId":  "$contracts.tenantAuthID"  }) 
      .lookup({ from: "tenants", localField: "contracts.tenantObjectId", foreignField: "authID", as: "tenants" })
      .unwind("$tenants") // Asegura que cada tenant esté en un documento separado
      .addFields({
        // Combinar monthlyRent directamente en el tenant
        "tenants.monthlyRent": "$contracts.monthlyRent",
        "tenants.currentProperty": "$properties.address",
      })
      .group({
      // Agrupar por ID de arrendador
      _id: '$_id',
      tenants: { $push: '$tenants'}
      })
      .exec();

    if (!tenants || tenants.length === 0) {
      throw createHttpError(404, "No active tenants found");
    }

    res.status(200).json(tenants);
  } catch (error) {
    console.error(error);
    next(error);
  }
};