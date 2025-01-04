import { RequestHandler } from "express";
import { TenantModel } from "../../models/users/tenant";
import createHttpError from "http-errors";

export const createTenant: RequestHandler = async (req, res, next) => {
  try {
    const tenantData = req.body;

    const existingTenant = await TenantModel.findOne({ id: tenantData.id }).exec();
    if (existingTenant) {
      throw createHttpError(409, "ID Already Taken");
    }

    const newTenant = await TenantModel.create(tenantData);
    res.status(201).json(newTenant);
  } catch (error) {
    next(error);
  }
};

export const updateTenant: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedTenant = await TenantModel.findOneAndUpdate({ id }, updatedData, {
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

    const deletedTenant = await TenantModel.findOneAndDelete({ id }).exec();
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

    const tenant = await TenantModel.findOne({ id }).exec();
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
