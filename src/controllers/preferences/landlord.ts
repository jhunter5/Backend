import { RequestHandler } from "express";
import { LandlordPreferenceModel } from "../../models/preferences/landlordPreference";
import createHttpError from "http-errors";

// Obtener una preferencia por su ID
export const getLandlordPreferenceById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const preference = await LandlordPreferenceModel.findById(id)
      .populate("landlord", "firstName lastName") // Poblar datos del arrendatario
      .exec();

    if (!preference) {
      throw createHttpError(404, `Preference with ID ${id} not found`);
    }

    res.status(200).json(preference);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las preferencias de un arrendatario por su ID
export const getLandlordPreferencesByLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { landlordId } = req.params;

    const preferences = await LandlordPreferenceModel.findOne({ landlordAuthID: landlordId })
      .populate("landlord", "firstName lastName") // Poblar datos del arrendatario
      .exec();

    if (!preferences) {
      throw createHttpError(404, `Preferences for landlord with ID ${landlordId} not found`);
    }

    res.status(200).json(preferences);
  } catch (error) {
    next(error);
  }
};

// Crear una nueva preferencia
export const createLandlordPreference: RequestHandler = async (req, res, next) => {
  try {
    const newPreference = new LandlordPreferenceModel(req.body);

    const savedPreference = await newPreference.save();

    res.status(201).json({
      message: "Preference created successfully",
      preference: savedPreference,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar una preferencia existente por su ID
export const updateLandlordPreference: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPreference = await LandlordPreferenceModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Retorna el documento actualizado y valida los cambios
    )
      .populate("landlord", "firstName lastName") // Poblar datos del arrendatario
      .exec();

    if (!updatedPreference) {
      throw createHttpError(404, `Preference with ID ${id} not found`);
    }

    res.status(200).json({
      message: "Preference updated successfully",
      preference: updatedPreference,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una preferencia por su ID
export const deleteLandlordPreference: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPreference = await LandlordPreferenceModel.findByIdAndDelete(id).exec();

    if (!deletedPreference) {
      throw createHttpError(404, `Preference with ID ${id} not found`);
    }

    res.status(200).json({ message: "Preference deleted successfully" });
  } catch (error) {
    next(error);
  }
};
