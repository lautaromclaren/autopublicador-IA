// backend/index.js

require('dotenv').config({ path: '../.env' });

// --- IMPORTACIONES ---
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- CONEXIÓN A DB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa.'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// --- CONFIGURACIÓN DE APP ---
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;

// --- RUTAS DE LA API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/generations', require('./routes/generations')); // <-- ¡AQUÍ ENCHUFAMOS LAS NUEVAS RUTAS!

// Ruta de estado simple (la podemos dejar)
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'El backend está conectado.' });
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto http://localhost:${PORT}`);
});