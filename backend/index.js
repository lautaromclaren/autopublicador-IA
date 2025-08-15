// Carga las variables de entorno del archivo .env
require('dotenv').config();
// Carga las variables de entorno (la clave API)
require('dotenv').config();

// Importaciones necesarias
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

// Configuración de OpenAI
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
//  NUESTRO ENDPOINT DE IA MEJORADO PARA GENERAR VARIACIONES
// =============================================================
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
          // <-- 1. ¡INSTRUCCIÓN MODIFICADA! Ahora pedimos 3 variaciones con un separador específico.
          content: `Genera 3 variaciones únicas y distintas para una publicación de Facebook basada en la siguiente idea: "${idea}". Separa cada variación con "|||".` 
        }
      ],
    });

    // Extraemos el bloque de texto completo generado por la IA
    const rawContent = completion.choices[0].message.content;

    // <-- 2. ¡NUEVO PROCESAMIENTO! Dividimos el texto en un array usando el separador.
    const generatedVariations = rawContent.split('|||').map(text => text.trim());

    console.log("Variaciones generadas por la IA con éxito:", generatedVariations);

    // <-- 3. ¡RESPUESTA MODIFICADA! Enviamos el array de variaciones al frontend.
    res.status(200).json({
      message: 'Contenido generado con éxito.',
      generatedVariations: generatedVariations // Ahora es una lista
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