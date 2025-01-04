import { InferSchemaType, model, Schema} from 'mongoose';

// soporte_contrato
const Message = new Schema({
    // contenido
    content: {
        type: String,
        maxlength: [1000, 'El contenido del mensaje debe tener máximo 1000 caracteres'],
    },
    // fecha_envio
    sentDate: {
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
type MessageType = InferSchemaType<typeof Message>
// Crear el modelo a partir del esquema
export const MessageModel = model<MessageType>(
  "message",
  Message
);