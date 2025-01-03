import { InferSchemaType, model, Schema} from 'mongoose';

// gasto
const Expense = new Schema({
    // descripción
    description: {
        type: String,
        maxlength: [1000, 'La descripción máxima debe tener máximo 1000 caracteres'],
    },
    // monto
    amount: {
        type: Number,
        required: [true, 'El monto del gasto es obligatorio'],
        min: [0, 'El monto del gasto debe ser un número positivo'],
    },
    // categoria
    category: {
        type: Number,
        required: [true, 'La categoria del gasto es obligatoria'],
        default: 0,
        min: [0, 'La categoria del gasto debe ser un número positivo'],       
    },
    // fecha_gasto
    expenseDate: {
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
type ExpenseType = InferSchemaType<typeof Expense>
// Crear el modelo a partir del esquema
export const ExpenseModel = model<ExpenseType>(
  "expense",
  Expense
);