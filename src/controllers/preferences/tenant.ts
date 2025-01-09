import { RequestHandler } from "express";
import { TenantPreferenceModel } from "../../models/preferences/tenantPreference";
import createHttpError from "http-errors";

// Obtener una preferencia por su ID
export const getTenantPreferenceById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const preference = await TenantPreferenceModel.findById(id)
      .populate("tenant", "firstName lastName email") // Poblar datos del inquilino
      .exec();

    if (!preference) {
      throw createHttpError(404, `Preference with ID ${id} not found`);
    }

    res.status(200).json(preference);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las preferencias de un inquilino por su ID
export const getTenantPreferencesByTenant: RequestHandler = async (req, res, next) => {
  try {
    const { tenantId } = req.params;

    const preferences = await TenantPreferenceModel.findOne({ tenantAuthID: tenantId })
      .populate("tenant", "firstName lastName email") // Poblar datos del inquilino
      .exec();

    if (!preferences) {
      throw createHttpError(404, `Preferences for tenant with ID ${tenantId} not found`);
    }

    res.status(200).json(preferences);
  } catch (error) {
    next(error);
  }
};

// Crear una nueva preferencia
export const createTenantPreference: RequestHandler = async (req, res, next) => {
  try {
    const newPreference = new TenantPreferenceModel(req.body);

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
export const updateTenantPreference: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPreference = await TenantPreferenceModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Retorna el documento actualizado y valida los cambios
    )
      .populate("tenant", "firstName lastName email") // Poblar datos del inquilino
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
export const deleteTenantPreference: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPreference = await TenantPreferenceModel.findByIdAndDelete(id).exec();

    if (!deletedPreference) {
      throw createHttpError(404, `Preference with ID ${id} not found`);
    }

    res.status(200).json({ message: "Preference deleted successfully" });
  } catch (error) {
    next(error);
  }
};
