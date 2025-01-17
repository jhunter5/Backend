import { RequestHandler } from "express";
import { LandlordModel } from "../../models/users/landlord";
import createHttpError from "http-errors";

import { uploadFileS3 } from "../../utils/S3"; // Asegúrate de importar correctamente la función de subida

export const createLandlord: RequestHandler = async (req, res, next) => {
  try {
    const {
      id,
      firstName,
      lastName,
      phone,
      email,
      numberOfProperties,
      avgRating,
    } = req.body;
    const avatarFile = req.files?.file; // La imagen enviada en el campo `file`

    // Verificar si el landlord ya existe
    const existingLandlord = await LandlordModel.findOne({ id }).exec();
    if (existingLandlord) {
      throw createHttpError(409, "ID Already Taken");
    }

    // Subir la imagen del avatar a S3
    let avatarUrl = null;
    if (avatarFile) {
      avatarUrl = await uploadFileS3(avatarFile); // Subir archivo y obtener URL
    } else {
      avatarUrl = ""; // Avatar predeterminado
    }

    // Crear el nuevo landlord
    const newLandlord = await LandlordModel.create({
      id,
      firstName,
      lastName,
      phone,
      email,
      numberOfProperties,
      avgRating,
      avatar: avatarUrl, // Asignar el enlace del avatar
    });

    res.status(201).json(newLandlord);
  } catch (error) {
    next(error);
  }
};

export const updateLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, email, numberOfProperties, avgRating } = req.body;

    const updatedLandlord = await LandlordModel.findOneAndUpdate(
      { id },
      { firstName, lastName, phone, email, numberOfProperties, avgRating, updatedAt: new Date() },
      { new: true }
    ).exec();

    if (!updatedLandlord) {
      throw createHttpError(404, `Landlord with ID ${id} not found`);
    }

    res.status(200).json(updatedLandlord);
  } catch (error) {
    next(error);
  }
};

export const deleteLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedLandlord = await LandlordModel.findOneAndDelete({ id }).exec();
    if (!deletedLandlord) {
      throw createHttpError(404, `Landlord with ID ${id} not found`);
    }

    res.status(200).json("Landlord successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showLandlord: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const landlord = await LandlordModel.findOne({ id }).exec();
    if (!landlord) {
      throw createHttpError(404, `Landlord with ID ${id} not found`);
    }

    res.status(200).json(landlord);
  } catch (error) {
    next(error);
  }
};

export const showLandlords: RequestHandler = async (req, res, next) => {
  try {
    const landlords = await LandlordModel.find().exec();
    if (!landlords || landlords.length === 0) {
      throw createHttpError(404, "No landlords found");
    }

    res.status(200).json(landlords);
  } catch (error) {
    next(error);
  }
};
