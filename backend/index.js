// backend/index.js - VERSIÓN LISTA PARA DESPLIEGUE

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

// --- RUTAS DE LA API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/generations', require('./routes/generations'));

// Ruta de estado simple
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'El backend está conectado.' });
});

// --- INICIAR SERVIDOR ---

// ¡CAMBIO CLAVE PARA EL DESPLIEGUE!
// Render nos dará un puerto en process.env.PORT. 
// Si no existe (porque estamos en local), usaremos el 3001 como respaldo.
const PORT = process.env.PORT || 3001; 

app.listen(PORT, () => {
  // Modificamos el mensaje para que nos diga en qué puerto está corriendo
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`); 
});