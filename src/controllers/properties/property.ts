import { RequestHandler } from "express";
import { PropertyModel } from "../../models/properties/property";
import createHttpError from "http-errors";

export const createProperty: RequestHandler = async (req, res, next) => {
  try {
    const propertyData = req.body;

    const newProperty = await PropertyModel.create(propertyData);
    res.status(201).json(newProperty);
  } catch (error) {
    next(error);
  }
};

export const updateProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProperty = await PropertyModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();

    if (!updatedProperty) {
      throw createHttpError(404, `Property with ID ${id} not found`);
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProperty = await PropertyModel.findByIdAndDelete(id).exec();
    if (!deletedProperty) {
      throw createHttpError(404, `Property with ID ${id} not found`);
    }

    res.status(200).json("Property successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showProperty: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await PropertyModel.findById(id).exec();
    if (!property) {
      throw createHttpError(404, `Property with ID ${id} not found`);
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

export const showProperties: RequestHandler = async (req, res, next) => {
  try {
    const properties = await PropertyModel.find().exec();
    if (!properties || properties.length === 0) {
      throw createHttpError(404, "No properties found");
    }

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};
