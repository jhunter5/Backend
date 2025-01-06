import { RequestHandler } from "express";
import { TenantModel } from "../../models/users/tenant";
import createHttpError from "http-errors";
import { uploadFileS3 } from "../../utils/S3";

export const createTenant: RequestHandler = async (req, res, next) => {
  try {
    const tenantData = req.body;
    const avatarFile = req.files?.file; // La imagen enviada en el campo `file`

    // Verificar si el tenant ya existe
    const existingTenant = await TenantModel.findOne({ authID: tenantData.authID }).exec();
    if (existingTenant) {
      throw createHttpError(409, "ID Already Taken");
    }

    // Subir la imagen del avatar a S3
    let avatarUrl = null;
    if (avatarFile) {
      avatarUrl = await uploadFileS3(avatarFile); // Subir archivo y obtener URL
    } else {
      avatarUrl = ""; // Avatar predeterminado
    }

    // Crear el nuevo tenant
    const newTenant = await TenantModel.create({
      ...tenantData,
      avatar: avatarUrl, // Asignar el enlace del avatar
    });

    res.status(201).json(newTenant);
  } catch (error) {
    next(error);
  }
};

export const updateTenant: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedTenant = await TenantModel.findOneAndUpdate({ authID:id }, updatedData, {
      new: true,
    }).exec();

    if (!updatedTenant) {
      throw createHttpError(404, `Tenant with ID ${id} not found`);
    }

    res.status(200).json(updatedTenant);
  } catch (error) {
    next(error);
  }
};

export const deleteTenant: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTenant = await TenantModel.findOneAndDelete({ authID:id }).exec();
    if (!deletedTenant) {
      throw createHttpError(404, `Tenant with ID ${id} not found`);
    }

    res.status(200).json("Tenant successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showTenant: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tenant = await TenantModel.findOne({ authID:id }).exec();
    if (!tenant) {
      throw createHttpError(404, `Tenant with ID ${id} not found`);
    }

    res.status(200).json(tenant);
  } catch (error) {
    next(error);
  }
};

export const showTenants: RequestHandler = async (req, res, next) => {
  try {
    const tenants = await TenantModel.find().exec();
    if (!tenants || tenants.length === 0) {
      throw createHttpError(404, "No tenants found");
    }

    res.status(200).json(tenants);
  } catch (error) {
    next(error);
  }
};
