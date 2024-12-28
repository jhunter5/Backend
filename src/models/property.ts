import { InferSchemaType, model, Schema} from 'mongoose';

const Property = new Schema({
    // dirección - longitud de direccion?
    address: {
        type: String,
        required: [true, 'La dirección es obligatoria'],        
        // minlength: [3, 'El nombre debe tener mínimo 3 caracteres'],
        // maxlength: [50, 'El nombre debe tener máximo 50 caracteres'],
    },
    // municipio
    city: {
        type: String,
        required: [true, 'La ciudad es obligatoria'],
        minlength: [3, 'La ciudad debe tener mínimo 3 caracteres'],
        maxlength: [50, 'La ciudad debe tener máximo 50 caracteres'],       
    },
    // departamento
    state: {
        type: String,
        required: [true, 'El departamento es obligatorio'],
        minlength: [3, 'El departamento debe tener mínimo 3 caracteres'],
        maxlength: [50, 'El departamento debe tener máximo 50 caracteres'],       
    },
    // tipo
    type: {
        type: String,
        required: [true, 'El tipo de propiedad es obligatorio'],
        minlength: [3, 'El tipo debe tener mínimo 3 caracteres'],
        maxlength: [50, 'El tipo debe tener máximo 50 caracteres'],       
    },
    // habitaciones
    rooms: {
        type: Number,
        required: [true, 'El número de habitaciones es obligatorio'],
        min: [0, 'El número de habitaciones no puede ser negativo'],
    },
    // parqueadero
    parking: {
        type: Boolean,
        required: [true, 'El parquadero es obligatorio'],
    },
    // metros_cuadrados
    squareMeters: {
        type: Number,
        required: [true, 'La cantidad de metros cuadrados es obligatoria'],
        min: [0, 'El número de metros cuadrados no puede ser negativo'],
    },
    // precio_sugerido
    suggestedPrice: {
        type: Number,
        required: [true, 'El precio sugerido es obligatorio'],
        min: [0, 'El precio sugerido no puede ser negativo'],
    },
    // estrato - la palabra más parecida sería tier (sujeto a cambios)
    tier: {
        type: Number,
        required: [true, 'El precio sugerido es obligatorio'],
        min: [0, 'El estrato mínimo debe ser 0'],
        max: [6, 'El estrato máximo debe ser 6'],
    },
    // cantidad_baños
    bathrooms: {
        type: Number,
        required: [true, 'El número de baños es obligatorio'],
        min: [0, 'El número mínimo de baños debe ser 0'],
    },
    // antiguedad - por propositos de simplicidad el nombre más adecuado sería age
    age: {
        type: Number,
        required: [true, 'El número de baños es obligatorio'],
        min: [0, 'El número mínimo de baños debe ser 0'],
    },
    // numero_pisos
    floors: {
        type: Number,
        required: [true, 'El número de baños es obligatorio'],
        min: [0, 'El número mínimo de baños debe ser 0'],
    },
    // descripción
    description: {
        type: String,
        maxlength: [1000, 'La descripción máxima debe tener máximo 1000 caracteres'],
    },    
    createdAt: {
        type: Date,
        default: Date.now,
      },
});
type PropertyType = InferSchemaType<typeof Property>
// Crear el modelo a partir del esquema
export const PropertyModel = model<PropertyType>(
  'property',
  Property
);