// backend/index.js - VERSIÓN FINAL PARA PRODUCCIÓN

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

// ¡CONFIGURACIÓN DE CORS PARA PRODUCCIÓN!
const corsOptions = {
  // Lista de orígenes permitidos
  origin: [
    'http://localhost:5173', 
    'https://autopublicador-ia.vercel.app' // ¡ASEGÚRATE DE QUE ESTA SEA TU URL REAL DE VERCEL!
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Usamos la nueva configuración de CORS
app.use(express.json());

// --- RUTAS DE LA API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/generations', require('./routes/generations'));

// Ruta de estado simple
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'El backend está conectado.' });
});


// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`); 
});