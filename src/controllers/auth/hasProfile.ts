import { RequestHandler, Response } from "express";
import { TenantModel } from "../../models/users/tenant";
import { LandlordModel } from "../../models/users/landlord";

export const verifyProfile: RequestHandler = async (req, res, next) => {
  const { userId } = req.body;

  try {
    // Buscar en el modelo Tenant
    const tenant = await TenantModel.findOne({ authId: userId }).exec();

    if (tenant) {
      res.status(200).json({ hasProfile: true, role: "Tenant" });
      return; // Aseguramos que no se ejecuten más líneas después de enviar la respuesta
    }

    // Buscar en el modelo Landlord
    const landlord = await LandlordModel.findOne({ authId: userId }).exec();

    if (landlord) {
      res.status(200).json({ hasProfile: true, role: "Landlord" });
      return; // Detenemos la ejecución aquí también
    }

    // Si no tiene perfil
    res.status(200).json({ hasProfile: false, role: null });
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

