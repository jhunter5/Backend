import { InferSchemaType, model, Schema} from 'mongoose';

const Contract = new Schema({
    // fecha_inicio
    startDate: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'],
    },
    // fecha_fin
    endDate: {
        type: Date,
        required: [true, 'La fecha de fin es obligatoria'],
    },
    // monto_mensual
    monthlyRent: {
        type: Number,
        required: [true, 'El monto mensual es obligatorio'],
        min: [0, 'El monto mensual no puede ser negativo'],
    },
    // estado - definir cuáles son los códigos de estado para determinar la longitud
    status: {
        type: String,
        required: [true, 'El estado del contrato es obligatorio'],       
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
type ContractType = InferSchemaType<typeof Contract>
// Crear el modelo a partir del esquema
export const ContractModel = model<ContractType>(
  "contract",
  Contract
);