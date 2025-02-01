import { RequestHandler } from "express";
import { ContractModel } from "../../models/contract/contract";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getAllContracts: RequestHandler = async (req, res, next) => {
  try {
    const contracts = await ContractModel.find()
      .exec();

    res.status(200).json(contracts);
  } catch (error) {
    next(error);
  }
};

export const getContractById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contract = await ContractModel.findById(id)
      .populate("propertyId", "address city state") // Poblar datos de la propiedad
      .populate("tenant", "name email") // Poblar datos del inquilino
      .exec();

    if (!contract) {
      throw createHttpError(404, `Contract with ID ${id} not found`);
    }

    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
};

export const getContractsByUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const contract = await ContractModel.find({tenant: userId})
      .populate("propertyId", "address city state") // Poblar datos de la propiedad
      .populate("tenant", "name email") // Poblar datos del inquilino
      .exec();

    if (!contract) {
      throw createHttpError(404, `Contract with ID ${userId} not found`);
    }

    res.status(200).json(contract);
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

export const getContractsByProperty: RequestHandler = async (req, res, next) => {
  try {
    
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw createHttpError(400, `Invalid property ID format: ${propertyId}`);
    }

    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    
    const contract = await ContractModel.findOne({propertyId: propertyObjectId}).exec();

    if (!contract) {
      throw createHttpError(404, `Contract with property ID ${propertyId} not found`);
    }

    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
};

export const getContractsByPropertyAndUser: RequestHandler = async (req, res, next) => {
  try {
    const { propertyId, tenantId } = req.params;

    const contract = await ContractModel.find({propertyId: propertyId, tenant:tenantId})
      .populate("propertyId", "address city state") // Poblar datos de la propiedad
      .populate("tenant", "name email") // Poblar datos del inquilino
      .exec();

    if (!contract) {
      throw createHttpError(404, `Contract with ID ${propertyId} not found`);
    }

    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
};

export const updateContract: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedContract = await ContractModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Retorna el documento actualizado y valida los cambios
    )
      .populate("propertyId", "address city state")
      .populate("tenant", "name email")
      .exec();

    if (!updatedContract) {
      throw createHttpError(404, `Contract with ID ${id} not found`);
    }

    res.status(200).json({
      message: "Contract updated successfully",
      contract: updatedContract,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContract: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedContract = await ContractModel.findByIdAndDelete(id).exec();

    if (!deletedContract) {
      throw createHttpError(404, `Contract with ID ${id} not found`);
    }

    res.status(200).json({ message: "Contract deleted successfully" });
  } catch (error) {
    next(error);
  }
};
