import { InferSchemaType, model, Schema} from 'mongoose';

const Payment = new Schema({
    // monto
    amount: {
        type: Number,
        required: [true, 'El monto mensual es obligatorio'],
        min: [0, 'El monto mensual no puede ser negativo'],
    },
    // fecha_pago
    paymentDate: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'],
    },
    // estado - definir cuáles son los códigos de estado para determinar la longitud
    status: {
        type: String,
        required: [true, 'El estado del pago es obligatorio'],       
    },
    // metodo_pago - definir cuáles son los códigos de estado para determinar la longitud
    paymentMethod: {
        type: String,
        required: [true, 'El método de pago es obligatorio'],       
    },
    // comprobante
    receipt: {
        type: String,
        required: [true, 'El comprobante de pago es obligatorio'],       
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
type PaymentType = InferSchemaType<typeof Payment>
// Crear el modelo a partir del esquema
export const PaymentModel = model<PaymentType>(
  "payment",
  Payment
);