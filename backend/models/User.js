// backend/models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },

  // =============================================================
  //  ¡NUEVOS CAMPOS PARA LA INTEGRACIÓN CON FACEBOOK!
  // =============================================================
  facebookId: {
    type: String, // El ID único que Facebook le asigna a cada usuario
    unique: true,
    sparse: true // Permite múltiples documentos con valor 'null', pero únicos si tienen valor
  },
  facebookAccessToken: {
    type: String // El token que nos permitirá hacer peticiones a la API de Facebook
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;