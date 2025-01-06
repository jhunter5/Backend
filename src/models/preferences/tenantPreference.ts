import { InferSchemaType, model, Schema} from 'mongoose';

// preferencia_arrendatario
const TenantPreference = new Schema({
    // inquilino_id - FK
    landlordAuthID: {
        type: String,
        ref: 'landlord', // Referencia al modelo landlord
        required: [true, 'El authID del arrendatario es obligatorio'],
        trim: true,
    },
    // tipo_preferencia
    preferenceType: {
        type: String,
        required: [true, 'El tipo de preferencia es obligatorio'],
        maxlength: [100, 'La preferencia debe tener máximo 100 caracteres'],
    },
    // valor_preferencia
    preferenceValue: {
        type: Number,
        required: [true, 'El valor de la preferencia es obligatoria'],
        min: [0, 'El valor mínimo de la preferencia es 0'],
        max: [10, 'El valor máximo de la preferencia es 10'],
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
type TenantPreferenceType = InferSchemaType<typeof TenantPreference>
// Crear el modelo a partir del esquema
export const TenantPreferenceModel = model<TenantPreferenceType>(
  "tenantpreference",
  TenantPreference
);