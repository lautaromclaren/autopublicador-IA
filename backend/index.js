// backend/index.js - VERSIÓN DE DEPURACIÓN DE CORS

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

// ¡CONFIGURACIÓN DE CORS SIMPLIFICADA PARA LA PRUEBA!
// Esto permitirá peticiones desde CUALQUIER origen.
app.use(cors()); 

app.use(express.json());

// --- RUTAS DE LA API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/generations', require('./routes/generations'));
app.use('/api/facebook', require('./routes/facebook'));
app.use('/api/user', require('./routes/user'));

// Ruta de estado simple
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'El backend está conectado.' });
});


// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`); 
});


