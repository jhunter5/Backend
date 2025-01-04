import { RequestHandler } from "express";
import { ApplicationModel } from "../../models/processes/application";
import createHttpError from "http-errors";

export const createApplication: RequestHandler = async (req, res, next) => {
  try {
    const applicationData = req.body;

    const newApplication = await ApplicationModel.create(applicationData);
    res.status(201).json(newApplication);
  } catch (error) {
    next(error);
  }
};

export const updateApplication: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedApplication = await ApplicationModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();

    if (!updatedApplication) {
      throw createHttpError(404, `Application with ID ${id} not found`);
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

export const deleteApplication: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedApplication = await ApplicationModel.findByIdAndDelete(id).exec();
    if (!deletedApplication) {
      throw createHttpError(404, `Application with ID ${id} not found`);
    }

    res.status(200).json("Application successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showApplication: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await ApplicationModel.findById(id).exec();
    if (!application) {
      throw createHttpError(404, `Application with ID ${id} not found`);
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const showApplications: RequestHandler = async (req, res, next) => {
  try {
    const applications = await ApplicationModel.find().exec();
    if (!applications || applications.length === 0) {
      throw createHttpError(404, "No applications found");
    }

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};
