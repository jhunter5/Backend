import { RequestHandler } from "express";
import { PropertyMediaModel } from "../../models/properties/propertyMedia";
import createHttpError from "http-errors";

export const createPropertyMedia: RequestHandler = async (req, res, next) => {
  try {
    const mediaData = req.body;

    const newPropertyMedia = await PropertyMediaModel.create(mediaData);
    res.status(201).json(newPropertyMedia);
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
      return; // Asegurarse de no continuar después de enviar una respuesta
    }

    // Registrar otros errores para depuración
    console.error(error);

    // Pasar el error a otros middlewares
    next(error);
  }
};

export const updatePropertyMedia: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPropertyMedia = await PropertyMediaModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();

    if (!updatedPropertyMedia) {
      throw createHttpError(404, `Media with ID ${id} not found`);
    }

    res.status(200).json(updatedPropertyMedia);
  } catch (error) {
    next(error);
  }
};

export const deletePropertyMedia: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPropertyMedia = await PropertyMediaModel.findByIdAndDelete(id).exec();
    if (!deletedPropertyMedia) {
      throw createHttpError(404, `Media with ID ${id} not found`);
    }

    res.status(200).json("Property Media deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const showPropertyMedia: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const propertyMedia = await PropertyMediaModel.findById(id).exec();
    if (!propertyMedia) {
      throw createHttpError(404, `Media with ID ${id} not found`);
    }

    res.status(200).json(propertyMedia);
  } catch (error) {
    next(error);
  }
};

export const showPropertyMedias: RequestHandler = async (req, res, next) => {
  try {
    const propertyMedias = await PropertyMediaModel.find().exec();
    if (!propertyMedias || propertyMedias.length === 0) {
      throw createHttpError(404, "No property media found");
    }

    res.status(200).json(propertyMedias);
  } catch (error) {
    next(error);
  }
};
