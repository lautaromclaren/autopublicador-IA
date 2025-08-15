// backend/models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 1. DEFINICIÓN DEL ESQUEMA
const userSchema = new Schema({
  email: {
    type: String,
    required: true, // El email es obligatorio
    unique: true,   // No puede haber dos usuarios con el mismo email
    lowercase: true, // Se guardará siempre en minúsculas
    trim: true      // Se limpiarán espacios en blanco al principio y al final
  },
  password: {
    type: String,
    required: true, // La contraseña es obligatoria
  },
  registeredAt: {
    type: Date,
    default: Date.now // La fecha de registro se creará automáticamente
  }
  // En el futuro, podríamos añadir más campos aquí:
  // subscriptionStatus: String,
  // apiCallsMade: Number,
  // etc.
});

// 2. CREACIÓN DEL MODELO
// Mongoose tomará nuestro esquema y creará un modelo.
// El primer argumento ('User') es el nombre singular del modelo.
// Mongoose automáticamente creará una colección en la base de datos llamada "users" (en plural y minúsculas).
const User = mongoose.model('User', userSchema);

// 3. EXPORTACIÓN DEL MODELO
// Exportamos el modelo para poder usarlo en otras partes de nuestra aplicación (como en las rutas de autenticación).
module.exports = User;