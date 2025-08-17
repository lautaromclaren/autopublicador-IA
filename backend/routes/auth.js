// backend/routes/auth.js - VERSIÓN FINAL Y COMPLETA

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const crypto = require('crypto'); // Necesario para la contraseña aleatoria

// --- RUTA DE REGISTRO ---
router.post('/register', async (req, res) => {
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

// --- RUTA DE LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error en el login:', error.message);
    res.status(500).send('Error en el servidor.');
  }
});

// --- RUTA PROTEGIDA "YO" ---
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor.');
  }
});

// --- RUTA DE CALLBACK DE FACEBOOK ---
router.get('/facebook/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ message: 'Autorización de Facebook fallida.' });
  }
  try {
    const tokenResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        redirect_uri: `http://localhost:5173/`, // Usamos la URI de desarrollo por ahora
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code: code,
      }
    });
    const accessToken = tokenResponse.data.access_token;
    const profileResponse = await axios.get(`https://graph.facebook.com/me`, {
      params: { fields: 'id,name,email', access_token: accessToken }
    });
    const { id: facebookId, email, name } = profileResponse.data;
    let user = await User.findOne({ facebookId: facebookId });
    if (!user) {
      user = new User({
        email: email,
        password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
        facebookId: facebookId,
        facebookAccessToken: accessToken,
      });
      await user.save();
    } else {
      user.facebookAccessToken = accessToken;
      await user.save();
    }
    const payload = { user: { id: user.id } };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:5173/auth/success?token=${jwtToken}`);
  } catch (error) {
    console.error('Error en el callback de Facebook:', error.response ? error.response.data : error.message);
    res.status(500).redirect(`http://localhost:5173/auth/error`);
  }
});
router.get('/facebook/callback/mock', authMiddleware, async (req, res) => {
  const userId = req.user.id; 
  try {
    let user = await User.findById(userId);
    if (!user.facebookId) {
      user.facebookId = `MOCK_${userId}`;
      user.facebookAccessToken = `MOCK_TOKEN_${userId}`;
      await user.save();
      console.log(`Datos de Facebook simulados añadidos al usuario ${userId}`);
    }
    res.json({ message: 'Conexión con Facebook simulada exitosamente.' });
  } catch (error) {
    console.error('Error en el callback simulado:', error.message);
    res.status(500).send('Error en el servidor.');
  }
});
module.exports = router;