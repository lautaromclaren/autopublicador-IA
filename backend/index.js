// backend/index.js

// Carga las variables de entorno del archivo .env que está en la carpeta raíz
require('dotenv').config({ path: '../.env' });

// =============================================================
//  1. IMPORTACIONES DE LIBRERÍAS
// =============================================================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const OpenAI = require('openai');

// =============================================================
//  2. CONEXIÓN A LA BASE DE DATOS MONGODB ATLAS
// =============================================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa.'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// =============================================================
//  3. CONFIGURACIÓN DE LA APLICACIÓN EXPRESS
// =============================================================
const openai = new OpenAI();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;

// =============================================================
//  4. ENDPOINTS DE LA API (TUS RUTAS)
// =============================================================

// <-- ¡AQUÍ ESTÁ LA NUEVA LÍNEA! Le decimos a Express que use nuestras rutas de autenticación
app.use('/api/auth', require('./routes/auth'));

// Endpoint de estado
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'El backend está conectado y listo para la batalla.'
  });
});

// Endpoint de IA para generar variaciones
app.post('/api/generate', async (req, res) => {
  const { idea } = req.body;
  console.log(`Petición recibida. Generando 3 variaciones para la idea: "${idea}"`);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "Eres un experto en copywriting para redes sociales, especializado en crear publicaciones para grupos de Facebook que generen interacción y ventas. Escribe en un tono persuasivo y amigable." 
        },
        { 
          role: "user", 
          content: `Genera 3 variaciones únicas y distintas para una publicación de Facebook basada en la siguiente idea: "${idea}". Separa cada variación con "|||".` 
        }
      ],
    });

    const rawContent = completion.choices[0].message.content;
    const generatedVariations = rawContent.split('|||').map(text => text.trim());
    console.log("Variaciones generadas por la IA con éxito:", generatedVariations);
    res.status(200).json({
      message: 'Contenido generado con éxito.',
      generatedVariations: generatedVariations
    });
  } catch (error) {
    console.error("Error al llamar a la API de OpenAI:", error);
    res.status(500).json({ 
      message: 'Error al generar el contenido.',
      error: error.message 
    });
  }
});

// =============================================================
//  5. INICIAR EL SERVIDOR
// =============================================================
app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto http://localhost:${PORT}`);
});