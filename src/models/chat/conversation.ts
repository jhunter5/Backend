import { InferSchemaType, model, Schema} from 'mongoose';

// conversación
const Conversation = new Schema({   
    // inquilino_id - FK
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: [true, 'El id del inquilino es obligatorio'],
    },
    // propietario_id - FK
    landlord: {
        type: Schema.Types.ObjectId,
        ref: 'landlord',
        required: [true, 'El id del arrendatario es obligatorio'],
    },
    // fecha_incio
    startDate: {
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
type ConversationType = InferSchemaType<typeof Conversation>
// Crear el modelo a partir del esquema
export const ConversationModel = model<ConversationType>(
  "conversation",
  Conversation
);