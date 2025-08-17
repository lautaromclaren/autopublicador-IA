const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSetSchema = new Schema({
  // Nombre que el usuario le da a este conjunto (ej: "Grupos de Venta")
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Referencia al usuario propietario de este conjunto
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // La lista de grupos de Facebook guardados en este conjunto
  groups: [{
    id: String,
    name: String
  }],
  // Fecha de creación
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Creamos un índice compuesto para asegurar que un usuario no pueda tener
// dos listas con el mismo nombre.
groupSetSchema.index({ user: 1, name: 1 }, { unique: true });

const GroupSet = mongoose.model('GroupSet', groupSetSchema);

module.exports = GroupSet;