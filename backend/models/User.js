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
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  facebookAccessToken: {
    type: String
  }
  // El campo selectedFacebookGroups ha sido eliminado.
});

const User = mongoose.model('User', userSchema);

module.exports = User;