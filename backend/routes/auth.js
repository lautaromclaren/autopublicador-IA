// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- 1. IMPORTAMOS JSONWEBTOKEN
const User = require('../models/User');

// --- RUTA DE REGISTRO: POST /api/auth/register ---
router.post('/register', async (req, res) => {
  // ... (toda la lógica de registro que ya funciona se mantiene igual)
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }
    user = new User({ email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error en el registro:', error.message);
    res.status(500).send('Error en el servidor.');
  }
});

// =============================================================
//  ¡NUEVA RUTA DE LOGIN!: POST /api/auth/login
// =============================================================
router.post('/login', async (req, res) => {
  // 1. Extraemos email y password
  const { email, password } = req.body;

  try {
    // 2. Buscamos al usuario por su email
    const user = await User.findOne({ email });
    if (!user) {
      // Si el usuario NO existe, devolvemos un error
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // 3. Comparamos la contraseña enviada con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Si las contraseñas NO coinciden, devolvemos el mismo error
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // 4. Si todo es correcto, creamos el "payload" para el token
    const payload = {
      user: {
        id: user.id // Guardamos el ID del usuario en el token
      }
    };

    // 5. Firmamos y generamos el token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Usamos nuestra clave secreta del .env
      { expiresIn: 3600 }, // El token expira en 1 hora (3600 segundos)
      (error, token) => {
        if (error) throw error;
        // 6. Enviamos el token de vuelta al cliente
        res.json({ token });
      }
    );

  } catch (error) {
    console.error('Error en el login:', error.message);
    res.status(500).send('Error en el servidor.');
  }
});

module.exports = router;