import { InferSchemaType, model, Schema} from 'mongoose';

// postulación
const Application = new Schema({
    // fecha_postulación
    applicationDate: {
        type: Date,
        required: [true, 'La fecha de envío es obligatoria'],
    },
    // estado - definir cuáles son los códigos de estado para determinar la longitud
    status: {
        type: String,
        required: [true, 'El estado de la aplicación es obligatoria'],       
    },
    // calificación - preguntar cuál es la escala de la calificación
    score: {
        type: Number,
        min: [0, 'La calificación no puede ser negativa'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
type ApplicationType = InferSchemaType<typeof Application>
// Crear el modelo a partir del esquema
export const ApplicationModel = model<ApplicationType>(
  'application',
  Application
);