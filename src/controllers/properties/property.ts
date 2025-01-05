import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PropertyModel } from "../../models/properties/property";
import { PropertyMediaModel } from "../../models/properties/propertyMedia";
import { uploadFileS3 } from "../../utils/S3";
import { ContractModel } from "../../models/contract/contract";

export const createProperty: RequestHandler = async (req, res, next) => {
  const {
    address,
    city,
    state,
    type,
    rooms,
    parking,
    squareMeters,
    tier,
    bathrooms,
    age,
    floors,
    description,
  } = req.body;
  const files = req.files?.files; // Array de archivos multimedia
  try {
    // Crear la propiedad
    const newProperty = await PropertyModel.create({
      address,
      city,
      state,
      type,
      rooms,
      parking,
      squareMeters,
      tier,
      bathrooms,
      age,
      floors,
      description,
    });

    // Manejar los archivos multimedia
    if (files && Array.isArray(files)) {
      const mediaPromises = files.map(async (file: any) => {
        // Subir archivo a S3
        const s3Result = await uploadFileS3(file);

        // Crear el documento PropertyMedia con referencia a la propiedad
        return await PropertyMediaModel.create({
          mediaType: file.mimetype,
          mediaUrl: s3Result,
          description: file.description || "",
          uploadDate: new Date(),
          propertyId: newProperty._id, // Asociar con la propiedad creada
        });
      });

      // Esperar a que todas las promesas terminen
      await Promise.all(mediaPromises);
    }

    res
      .status(201)
      .json({
        message: "Property created successfully",
        property: newProperty,
      });
  } catch (error) {
    next(error);
  }
};

export const updateProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    ).exec();

    if (!updatedProperty) {
      throw createHttpError(404, `Property with ID ${id} not found`);
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProperty = await PropertyModel.findByIdAndDelete(id).exec();
    if (!deletedProperty) {
      throw createHttpError(404, `Property with ID ${id} not found`);
    }

    res.status(200).json("Property successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar la propiedad por ID
    const property = await PropertyModel.findById(id).exec();
    if (!property) {
      throw createHttpError(404, `Property with ID ${id} not found`);
    }

    // Buscar los medios asociados a la propiedad
    const media = await PropertyMediaModel.find({ propertyId: id }).exec();

    // Buscar el contrato asociado a la propiedad
    const contract = await ContractModel.findOne({ property: id })
      .populate("tenant", "name email") // Poblar datos del inquilino si es necesario
      .exec();

    // Enviar la propiedad con sus medios y contrato
    res.status(200).json({ property, media, contract });
  } catch (error) {
    next(error);
  }
};

export const showProperties: RequestHandler = async (req, res, next) => {
  try {
    const properties = await PropertyModel.find().exec();
    if (!properties || properties.length === 0) {
      throw createHttpError(404, "No properties found");
    }

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const showPropertiesByUser: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;

  try {
    // Buscar propiedades asociadas al usuario
    const properties = await PropertyModel.find({ landlord:"677b06ae4d1beaef236bb640" }).exec();
    if (!properties || properties.length === 0) {
      throw createHttpError(404, "No properties found");
    }

    // Mapear propiedades con sus respectivos medios
    const propertiesWithMedia = await Promise.all(
      properties.map(async (property) => {
        const media = await PropertyMediaModel.find({ propertyId: property._id }).exec();
        const contract = await ContractModel.findOne({ propertyId: property._id })
        .populate("tenant", "name email") // Poblar datos del inquilino si es necesario
        .exec();
  
        return { ...property.toObject(), media, contract };
      })
    );

    // Enviar las propiedades con sus medios
    res.status(200).json(propertiesWithMedia);
  } catch (error) {
    next(error);
  }
};
