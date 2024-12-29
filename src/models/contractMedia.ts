import { InferSchemaType, model, Schema} from 'mongoose';

const ContractMedia = new Schema({
    // tipo_documento - definir cuáles son los códigos de documento para determinar la longitud
    documentType: {
        type: String,
        required: [true, 'El tipo de documento del contrato es obligatorio'],       
    },
    // url_documento
    documentUrl: {
        type: String,
        required: [true, 'El estado del contrato es obligatorio'],       
    },
    // fecha_subida
    uploadDate: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'],
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
type ContractMediaType = InferSchemaType<typeof ContractMedia>
// Crear el modelo a partir del esquema
export const ContractMediaModel = model<ContractMediaType>(
  "contractmedia",
  ContractMedia
);