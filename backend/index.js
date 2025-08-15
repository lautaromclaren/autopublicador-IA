// Carga las variables de entorno (la clave API)
require('dotenv').config();

// Importaciones necesarias
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // <-- 1. IMPORTAMOS LA LIBRERÍA DE OPENAI

// 2. CONFIGURACIÓN DE OPENAI
// Creamos una nueva instancia, la librería automáticamente buscará la clave en las variables de entorno (process.env.OPENAI_API_KEY)
const openai = new OpenAI();

// Configuración de Express
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;

// --- ENDPOINTS DE LA API ---

// Endpoint de estado
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'El backend está conectado y listo para la batalla.'
  });
});

// =============================================================
//  NUESTRO ENDPOINT DE IA MEJORADO
// =============================================================
app.post('/api/generate', async (req, res) => {
  // Extraemos la idea del usuario
  const { idea } = req.body;

  console.log(`Petición recibida. Generando texto para la idea: "${idea}"`);

  try {
    // 3. LLAMADA A LA API DE OPENAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // El modelo que usaremos. Es rápido y económico.
      messages: [
        { 
          role: "system", 
          content: "Eres un experto en copywriting para redes sociales, especializado en crear publicaciones para grupos de Facebook que generen interacción y ventas. Escribe en un tono persuasivo y amigable." 
        },
        { 
          role: "user", 
          content: `Genera un texto para una publicación de Facebook basado en la siguiente idea: "${idea}"` 
        }
      ],
    });

    // Extraemos el texto generado por la IA de la respuesta
    const generatedText = completion.choices[0].message.content;

    console.log("Texto generado por la IA con éxito.");

    // 4. ENVIAMOS EL TEXTO GENERADO DE VUELTA AL FRONTEND
    res.status(200).json({
      message: 'Contenido generado con éxito.',
      generatedContent: generatedText
    });

  } catch (error) {
    console.error("Error al llamar a la API de OpenAI:", error);
    res.status(500).json({ 
      message: 'Error al generar el contenido.',
      error: error.message 
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto http://localhost:${PORT}`);
});