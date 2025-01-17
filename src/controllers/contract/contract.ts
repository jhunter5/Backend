import { RequestHandler } from "express";
import { ContractModel } from "../../models/contract/contract";
import createHttpError from "http-errors";

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
      next(error);
    }
  };

  export const getContractsByProperty: RequestHandler = async (req, res, next) => {
    try {
      const { propertyId } = req.params;
  
      const contract = await ContractModel.find({propertyId: propertyId})
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
  