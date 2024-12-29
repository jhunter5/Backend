import { InferSchemaType, model, Schema} from 'mongoose';

const Notification = new Schema({
    // mensaje - longitud del mensaje?
    message: {
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
     // fecha_envio
     sentDate: {
        type: Date,
        required: [true, 'La fecha de envío es obligatoria'],
    },
    // fecha_lectura
    readDate: {
        type: Date,
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
type NotificationType = InferSchemaType<typeof Notification>
// Crear el modelo a partir del esquema
export const NotificationModel = model<NotificationType>(
  'notification',
  Notification
);