import { RequestHandler } from "express";
import { ApplicationModel } from "../../models/processes/application/application";
import createHttpError from "http-errors";
import { ApplicationReferenceModel } from "../../models/processes/application/applicationReference";
import { uploadFileS3 } from "../../utils/S3";
import { ApplicationMediaModel } from "../../models/processes/application/applicationDocument";
import { TenantModel } from "../../models/users/tenant";

export const createApplication: RequestHandler = async (req, res, next) => {
  try {
    const { applicationData, applicationMedias, applicationReferences } =
      req.body;
    console.log(applicationData);
    console.log(applicationReferences);
    // Crear la postulación
    const newApplication = await ApplicationModel.create(applicationData);

    // Manejar múltiples medios
    const mediaUrls = await Promise.all(
      applicationMedias.map(async (media: { file: any }) => {
        const mediaUrl = await uploadFileS3(media.file); // Asumiendo que 'file' es un objeto con 'data' y 'name'
        return {
          ...media,
          mediaUrl,
          application: newApplication._id, // Asociar cada medio con la postulación creada
        };
      })
    );
    const newMedias = await ApplicationMediaModel.insertMany(mediaUrls);

    // Manejar múltiples referencias
    const references = applicationReferences.map((ref: any) => ({
      ...ref,
      application: newApplication._id, // Asociar cada referencia con la postulación creada
    }));

    const newReferences = await ApplicationReferenceModel.insertMany(
      references
    );

    // Enviar respuesta con la postulación y sus detalles asociados
    res.status(201).json({
      application: newApplication,
      medias: newMedias,
      references: newReferences,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    next(error);
  }
};

export const updateApplication: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedApplication = await ApplicationModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    ).exec();

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

    const deletedApplication = await ApplicationModel.findByIdAndDelete(
      id
    ).exec();
    if (!deletedApplication) {
      throw createHttpError(404, `Application with ID ${id} not found`);
    }

    res.status(200).json("Application successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showApplication: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Primero, obtener la aplicación
    const application = await ApplicationModel.findById(id)
      .populate("tenant")
      .exec();
    if (!application) {
      throw createHttpError(404, `Application with ID ${id} not found`);
    }

    // Luego, obtener ApplicationReference y ApplicationDocument asociados
    const references = await ApplicationReferenceModel.find({
      application: id,
    }).exec();
    const documents = await ApplicationMediaModel.find({
      application: id,
    }).exec();

    // Enviar todos los datos en la respuesta
    res.status(200).json({
      application,
      references,
      documents,
    });
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

export const showApplicationsByProperty: RequestHandler = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  try {
    // Obtener aplicaciones con el inquilino poblado
    const applications = await ApplicationModel.find({ property: id })
      .populate("tenant")
      .exec();
    if (!applications || applications.length === 0) {
      throw createHttpError(404, "No applications found");
    }

    // Extraer datos demográficos de las aplicaciones
    const demographics = extractDemographics(applications);

    // Devolver aplicaciones con datos demográficos
    res.status(200).json({
      applications,
      demographics,
    });
  } catch (error) {
    next(error);
  }
};

// Interface para las estadísticas demográficas
interface Demographics {
  ageGroups: Array<{ group: string; count: number }>;
  industries: Array<{ industry: string; count: number }>;
}
export interface Tenant {
  age: number;
  industry?: string;
}
export interface Application {
  tenant: Tenant;
}
// Función para extraer datos demográficos desde las aplicaciones
function extractDemographics(applications: any): Demographics {
  const ageBuckets = { "18-25": 0, "26-35": 0, "36-45": 0, "46+": 0 };
  const industryCount: { [key: string]: number } = {};

  applications.forEach((app: { tenant: { age: any; industry: string } }) => {
    const age = app.tenant.age;
    const industry = app.tenant.industry || "Otros";

    // Cálculo de grupos de edad
    if (age < 26) ageBuckets["18-25"]++;
    else if (age < 36) ageBuckets["26-35"]++;
    else if (age < 46) ageBuckets["36-45"]++;
    else ageBuckets["46+"]++;

    // Conteo de industrias
    industryCount[industry] = (industryCount[industry] || 0) + 1;
  });

  return {
    ageGroups: Object.entries(ageBuckets).map(([group, count]) => ({
      group,
      count,
    })),
    industries: Object.entries(industryCount).map(([industry, count]) => ({
      industry,
      count,
    })),
  };
}

export const updateApplicationStatus: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await ApplicationModel.findById(id).exec();
    if (!application) {
      throw createHttpError(404, `Application with ID ${id} not found`);
    }
    application.status = status;
    application.save();

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};


export const getApplicationsByTenant: RequestHandler = async (req, res, next) => {
  const { id } = req.params; // ID of the tenant
  const { year } = req.query as { year?: string }; // Explicitly define the query type

  try {
    if (!year) {
      res.status(400).json({ message: "Year is required" });
      return; // Ensure to return after sending response to stop further execution
    }

    const yearStart = new Date(`${year}-01-01T00:00:00.000Z`); // Start of the year
    const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`); // End of the year

    const applications = await ApplicationModel.find({
      tenant: id,
      createdAt: {
        $gte: yearStart, // Greater than or equal to start of the year
        $lte: yearEnd   // Less than or equal to end of the year
      }
    }).exec();

    // Fetch references and documents for each application
    const referencesPromises = applications.map(app => 
      ApplicationReferenceModel.find({ application: app._id }).exec()
    );
    const documentsPromises = applications.map(app => 
      ApplicationMediaModel.find({ application: app._id }).exec()
    );

    // Resolve all promises simultaneously
    const references = await Promise.all(referencesPromises);
    const documents = await Promise.all(documentsPromises);

    // Format response with applications, their references, and documents
    res.status(200).json({
      applications: applications.map((app, index) => ({
        application: app,
        references: references[index],
        documents: documents[index]
      }))
    });
    return; // Explicitly return to clarify to TypeScript that nothing is returned
  } catch (error) {
    next(error);
    return; // Return after calling next with the error
  }
};
