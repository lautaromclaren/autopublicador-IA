// backend/routes/generations.js

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const authMiddleware = require('../middleware/auth');
const Generation = require('../models/Generation');

const openai = new OpenAI();

// 1. Objeto con las personalidades (system prompts) para la IA
const tonePrompts = {
  'Venta': 'Eres un experto en copywriting para redes sociales, especializado en crear publicaciones para grupos de Facebook que generen ventas directas. Usas un tono persuasivo, creas urgencia y destacas los beneficios del producto.',
  'Creativo': 'Eres un storyteller creativo y original. Tu objetivo es crear publicaciones para grupos de Facebook que capturen la imaginación, generen conversación y construyan una comunidad alrededor de una idea.',
  'Informativo': 'Eres un experto en un tema que comunica de forma clara, concisa y objetiva. Tu meta es educar a la audiencia de grupos de Facebook, aportando datos, hechos y consejos útiles.',
  'Divertido': 'Eres un comediante o creador de contenido de humor. Tu estilo es ingenioso, usas memes, chistes y un lenguaje coloquial para crear publicaciones virales y entretenidas en grupos de Facebook.',
  'default': 'Eres un asistente de IA experto en redes sociales.'
};

// --- RUTA PARA GENERAR CONTENIDO: POST /api/generations ---
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  // 2. AHORA TAMBIÉN EXTRAEMOS EL 'tone' DE LA PETICIÓN
  const { idea, tone } = req.body;

  if (!idea) { return res.status(400).json({ message: 'La idea es requerida.' }); }

  // 3. SELECCIONAMOS EL PROMPT DEL SISTEMA BASADO EN EL TONO
  const systemPrompt = tonePrompts[tone] || tonePrompts['default'];

  console.log(`Petición de ${userId}. Tono: "${tone}". Generando para: "${idea}"`);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          // 4. USAMOS NUESTRO PROMPT DINÁMICO
          content: systemPrompt
        },
        { 
          role: "user", 
          content: `Genera 3 variaciones únicas y distintas para una publicación de Facebook basada en la siguiente idea: "${idea}". Separa cada variación con "|||".` 
        }
      ],
    });

    const rawContent = completion.choices[0].message.content;
    const variations = rawContent.split('|||').map(text => text.trim()).filter(text => text);

    const newGeneration = new Generation({
      user: userId,
      prompt: idea,
      variations: variations,
      // Opcional: podríamos guardar el tono usado también
      // tone: tone 
    });

    await newGeneration.save();
    console.log(`Generación guardada en la BD para el usuario ${userId}`);

    res.status(201).json({
      message: 'Contenido generado y guardado con éxito.',
      generatedVariations: variations
    });

  } catch (error) {
    console.error("Error en la generación:", error);
    res.status(500).json({ message: 'Error al generar el contenido.' });
  }
});

// --- RUTA PARA OBTENER EL HISTORIAL: GET /api/generations ---
router.get('/', authMiddleware, async (req, res) => {
  // ... (esta ruta se mantiene exactamente igual)
});

module.exports = router;