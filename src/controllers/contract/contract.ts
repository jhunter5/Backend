import { RequestHandler } from "express";
import { ContractModel } from "../../models/contract/contract";
import createHttpError from "http-errors";
import { uploadFileS3 } from "../../utils/S3";
import { ContractDocumentModel } from "../../models/contract/contractDocument";
import { TenantModel } from "../../models/users/tenant";


export const createContract: RequestHandler = async (req, res, next) => {
  try {
    const { contractData, contractDocs } = req.body;

    console.log(req.body)
    // Crear la postulación
    const newContract = await ContractModel.create(contractData);

    // Manejar múltiples medios
    const docUrls = await Promise.all(
      contractDocs.map(async (doc: { file: any }) => {
        const docUrl = await uploadFileS3(doc.file); // Asumiendo que 'file' es un objeto con 'data' y 'name'
        return {
          ...doc,
          documentUrl:docUrl,
          contract: newContract._id, // Asociar cada medio con la postulación creada
        };
      })
    );
    const newDocs = await ContractDocumentModel.insertMany(docUrls);



    // Enviar respuesta con la postulación y sus detalles asociados
    res.status(201).json({
      contract: newContract,
      docs: newDocs,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    next(error);
  }
};


export const getContractById: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const contract = await ContractModel.findById(id)
        .populate("propertyId", "address city state") // Poblar datos de la propiedad
        .exec();
  
      if (!contract) {
        throw createHttpError(404, `Contract with ID ${id} not found`);
      }
  
      res.status(200).json(contract);
    } catch (error) {
      next(error);
    }
  };


  export const getContractsByTenant: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Buscar los contratos asociados al tenantAuthID
      const contracts = await ContractModel.find({ tenantAuthID: id })
        .populate("propertyId") // Poblar datos de la propiedad
        .exec(); // No intentamos poblar tenantAuthID porque no es un ObjectId
  
      if (!contracts || contracts.length === 0) {
        throw createHttpError(404, `No contracts found for tenant ID ${id}`);
      }
  
      // Recuperar los detalles del inquilino manualmente
      const tenantDetails = await TenantModel.findOne({ authID: id }).exec();
  
      // Agregar detalles del inquilino manualmente a cada contrato
      const contractsWithTenant = contracts.map(contract => ({
        ...contract.toObject(),
        tenant: tenantDetails, // Reemplaza tenantAuthID con la información completa del inquilino
      }));
  
      res.status(200).json(contractsWithTenant);
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
  
      console.error(error);
      next(error);
    }
  };

  export const getContractsByProperty: RequestHandler = async (req, res, next) => {
    try {
      const { propertyId } = req.params;
  
      // Buscar contratos basados en el ID de la propiedad
      const contracts = await ContractModel.find({ propertyId: propertyId })
        .populate("propertyId") // Poblar datos de la propiedad
        .exec();
  
      if (!contracts.length) {
        throw createHttpError(404, `Contracts for property with ID ${propertyId} not found`);
      }
  
      // Recuperar detalles de cada inquilino de forma manual
      const contractsDetailed = await Promise.all(contracts.map(async contract => {
        const tenantDetails = await TenantModel.findOne({ authID: contract.tenantAuthID }).exec();
        return {
          ...contract.toObject(),
          tenant: tenantDetails ? {
            name: (tenantDetails as any).name,
            email: tenantDetails.email
          } : null // Solo incluir los campos necesarios
        };
      }));
  
      res.status(200).json(contractsDetailed);
    } catch (error) {
      next(error);
    }
  };

  export const getContractsByPropertyAndUser: RequestHandler = async (req, res, next) => {
    try {
      const { propertyId, tenantId } = req.params;
  
      const contract = await ContractModel.find({propertyId: propertyId, tenantAuthID:tenantId})
        .populate("propertyId", "address city state") // Poblar datos de la propiedad
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
  

  export const getActiveContractsByTenant: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Buscar los contratos activos asociados al tenantAuthID
      const contracts = await ContractModel.find({ tenantAuthID: id, status: "1" })
        .populate("propertyId") // Poblar datos de la propiedad
        .exec(); // No intentamos poblar tenantAuthID porque no es un ObjectId
  
      if (!contracts || contracts.length === 0) {
        throw createHttpError(404, `No active contracts found for tenant ID ${id}`);
      }
  
      // Recuperar los detalles del inquilino manualmente
      const tenantDetails = await TenantModel.findOne({ authID: id }).exec();
  
      // Agregar detalles del inquilino manualmente a cada contrato
      const contractsWithTenant = contracts.map(contract => ({
        ...contract.toObject(),
        tenant: tenantDetails, // Reemplaza tenantAuthID con la información completa del inquilino
      }));
  
      res.status(200).json(contractsWithTenant);
    } catch (error) {
      next(error);
    }
  };
