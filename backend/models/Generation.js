// backend/models/Generation.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generationSchema = new Schema({
  // 1. EL USUARIO CREADOR
  // Guardamos una referencia al ID del usuario que creó esta generación.
  // Esto nos permitirá vincular cada generación a un usuario específico.
  user: {
    type: Schema.Types.ObjectId, // El tipo de dato para IDs de MongoDB
    ref: 'User', // Le dice a Mongoose que este ID se refiere a un documento en la colección 'User'
    required: true
  },

  // 2. LA IDEA ORIGINAL
  // Guardamos la idea original que el usuario introdujo en el formulario.
  prompt: {
    type: String,
    required: true,
    trim: true
  },

  // 3. LAS VARIACIONES GENERADAS
  // Guardamos la lista (array) de textos que la IA generó.
  variations: [{
    type: String,
    trim: true
  }],

  // 4. LA FECHA DE CREACIÓN
  // Se registrará automáticamente la fecha en que se creó este documento.
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Generation = mongoose.model('Generation', generationSchema);

module.exports = Generation;