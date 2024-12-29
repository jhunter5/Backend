import { InferSchemaType, model, Schema} from 'mongoose';

const Repair = new Schema({
    // descripción - longitud de la descripción?
    description: {
        type: String,
        required: [true, 'La dirección es obligatoria'],        
        // minlength: [3, 'El nombre debe tener mínimo 3 caracteres'],
        // maxlength: [50, 'El nombre debe tener máximo 50 caracteres'],
    },
    // prioridad - códigos de la prioridad?
    priority: {
        type: String,
        required: [true, 'La dirección es obligatoria'],        
        // minlength: [3, 'El nombre debe tener mínimo 3 caracteres'],
        // maxlength: [50, 'El nombre debe tener máximo 50 caracteres'],
    },
    // estado - definir cuáles son los códigos de estado para determinar la longitud
    status: {
        type: String,
        required: [true, 'El estado de la reparación es obligatorio'],       
    },
     // fecha_reporte
     reportDate: {
        type: Date,
        required: [true, 'La fecha de reporte es obligatoria'],
    },
    // fecha_resolución
    resolutionDate: {
        type: Date,
    },
    // costo
    cost: {
        type: Number,
        required: [true, 'El costo de la reparación es obligatorio'],
        min: [0, 'El costo de la reparación no puede ser negativo'],
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
type RepairType = InferSchemaType<typeof Repair>
// Crear el modelo a partir del esquema
export const RepairModel = model<RepairType>(
  'repair',
  Repair
);