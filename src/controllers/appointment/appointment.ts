import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointment/appointment";
import { PropertyModel } from "../../models/properties/property";
import { LandlordModel } from "../../models/users/landlord";
import { TenantModel } from "../../models/users/tenant";

export const createAppointment: RequestHandler = async (req, res, next) => {
    const { landLordAuthID, tenantAuthID, propertyID, title, date, time, description } = req.body;
    try {
        // Verificar que el arrendador existe
        console.log('LANDLORD ' + landLordAuthID);
        const landLordAuthIDObjectId = new Types.ObjectId(landLordAuthID);
        
        const landlord = await LandlordModel.findOne({ authID: landLordAuthIDObjectId });
        if (!landlord) {
        throw createHttpError(404, "El arrendador no existe");
        }
    
        // Verificar que el arrendatario existe
        // const tenant = await TenantModel.findById(tenantAuthID);
        // if (!tenant) {
        // throw createHttpError(404, "El arrendatario no existe");
        // }
    
        // // Verificar que la propiedad existe
        // const property = await PropertyModel.findById(propertyID);
        // if (!property) {
        // throw createHttpError(404, "La propiedad no existe");
        // }
    
        // Crear la cita
        const newAppointment = await AppointmentModel.create({
        landLordAuthID,
        tenantAuthID,
        propertyID,
        title,
        date,
        time,
        description,
        });

        res.status(200).json({
            message: "Appointment created successfully",
            property: newAppointment,
        });
    } catch (error) {
        if ((error as any).name === "ValidationError") {
            // Manejo de errores de validación de Mongoose
            const validationErrors = Object.values((error as any).errors).map(
              (err: any) => ({
                field: err.path,
                message: err.message,
              })
            );
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

export const showAppointment: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    try {
        const appointment = await AppointmentModel.findById(id);
        if (!appointment) {
        throw createHttpError(404, "Cita no encontrada");
        }
        
        const landlord = await LandlordModel.findById(appointment.landLordAuthID);
        const tenant = await TenantModel.findById(appointment.tenantAuthID);
        const property = await PropertyModel.findById(appointment.propertyID);

        res.json({
            appointment,
            landlord,
            tenant,
            property
        });
    } catch (error) {
        next(error);
    }
};

export const showAllThisYearAppointmentsByLandlord: RequestHandler = async (req, res, next) => {
    const { landLordAuthID } = req.params;
    const landLordAuthIDObjectId = new Types.ObjectId(landLordAuthID);

    try {
        const appointments = await AppointmentModel.find({
            landLordAuthID: landLordAuthIDObjectId,
        date: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear(), 11, 31),
        },
        });
        console.log(appointments);
        res.json(appointments);
    } catch (error) {
        next(error);
    }
};

export const showAllThisYearAppointmentsByTenant: RequestHandler = async (req, res, next) => {
    const { tenantAuthID } = req.params;
    const tenantAuthIDObjectId = new Types.ObjectId(tenantAuthID);

    try {
        const appointments = await AppointmentModel.find({
        tenantAuthID: tenantAuthIDObjectId,
        date: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear(), 11, 31),
        },
        });
        res.json(appointments);
    } catch (error) {
        next(error);
    }
}
