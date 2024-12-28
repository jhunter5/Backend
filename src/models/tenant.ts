import { InferSchemaType, model, Schema} from 'mongoose';

const Tenant = new Schema({
    // No existe una traducción para 'cedula', por eso id
    id: {
        type: Number,
        required: [true, 'El número de cedula es obligatorio'],
        trim: true,
        min: [1111111, 'La cédula debe tener mínimo 7 dígitos'],
        max: [9999999999, 'La cédula debe tener máximo 10 dígitos'],
    },
    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio'],        
        minlength: [3, 'El nombre debe tener mínimo 3 caracteres'],
        maxlength: [50, 'El nombre debe tener máximo 50 caracteres'],
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        minlength: [3, 'El apellido debe tener mínimo 3 caracteres'],
        maxlength: [50, 'El apellido debe tener máximo 50 caracteres'],       
    },
    phone: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio'],
        match: [
            /^[0-9]{10,15}$/,
            'Por favor, ingrese un número de teléfono válido',
          ],
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        lowercase: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, ingrese un correo electrónico válido',
          ],
    },
    // calificación_promedio - calificación de 0 a 5, sujeto a cambios
    averageRating: {
        type: Number,
        default: 0,
        min: [0, 'La calificación mínima debe ser 0'],
        max: [5, 'La calificación máxima debe ser 5'],
    },
    // contratos_previos
    previousContracts: {
        type: Number,
        default: 0,
        min: [0, 'El número de contratos no puede ser negativo'],
    },
    // clasificación - calificación de 0 a 5, sujeto a cambios
    rating: {
        type: Number,
        default: 0,
        min: [0, 'La clasificación mínima debe ser 0'],
        max: [5, 'La clasificación máxima debe ser 5'],
    },
    // puntualidad_pagos - calificación de 0 a 5, sujeto a cambios
    paymentBehavior: {
        type: Number,
        default: 0,
        min: [0, 'La puntualidad de págos mínima debe ser 0'],
        max: [5, 'La puntualidad de págos máxima debe ser 5'],
    },
    // antiguedad_plataforma - en días, aunque, sujeto a cambios
    tenure: {
        type: Number,
        default: 0,
        min: [0, 'Los días de antiguedad mínima deben ser 0'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});
type TenantType = InferSchemaType<typeof Tenant>
// Crear el modelo a partir del esquema
export const TenantModel = model<TenantType>(
  'tenant',
  Tenant
);