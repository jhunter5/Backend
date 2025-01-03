import { InferSchemaType, model, Schema} from 'mongoose';

// conversación
const Conversation = new Schema({   
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