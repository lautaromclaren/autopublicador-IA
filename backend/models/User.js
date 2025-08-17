// backend/models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { /* ... se mantiene igual ... */ },
  password: { /* ... se mantiene igual ... */ },
  registeredAt: { /* ... se mantiene igual ... */ },
  facebookId: { /* ... se mantiene igual ... */ },
  facebookAccessToken: { /* ... se mantiene igual ... */ },

  // =============================================================
  //  ¡NUEVO CAMPO PARA GUARDAR LA SELECCIÓN DE GRUPOS!
  // =============================================================
  // Guardaremos un array de objetos. Cada objeto tendrá el ID y el nombre del grupo.
  selectedFacebookGroups: [{
    id: String,
    name: String
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;