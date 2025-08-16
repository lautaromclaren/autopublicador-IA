// backend/routes/generations.js

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const authMiddleware = require('../middleware/auth');
const Generation = require('../models/Generation');

const openai = new OpenAI();

// --- RUTA PARA GENERAR CONTENIDO: POST /api/generations ---
router.post('/', authMiddleware, async (req, res) => {
  // ... (toda la lógica de generación y guardado se mantiene exactamente igual)
  const userId = req.user.id;
  const { idea } = req.body;
  if (!idea) { return res.status(400).json({ message: 'La idea es requerida.' }); }
  console.log(`Petición de ${userId}. Generando 3 variaciones para: "${idea}"`);
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un experto en copywriting para redes sociales..." },
        { role: "user", content: `Genera 3 variaciones únicas...para: "${idea}". Separa cada variación con "|||".` }
      ],
    });
    const rawContent = completion.choices[0].message.content;
    const variations = rawContent.split('|||').map(text => text.trim()).filter(text => text);
    const newGeneration = new Generation({ user: userId, prompt: idea, variations: variations });
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


// =============================================================
//  ¡NUEVA RUTA PARA OBTENER EL HISTORIAL!: GET /api/generations
// =============================================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    // 1. Buscamos en la BD todas las generaciones que coincidan con el ID del usuario logueado
    const generations = await Generation.find({ user: req.user.id })
                                        // 2. Las ordenamos por fecha de creación, de la más nueva a la más antigua
                                        .sort({ createdAt: -1 }); 

    // 3. Devolvemos la lista de generaciones encontradas
    res.json(generations);
  } catch (error) {
    console.error('Error al obtener el historial:', error.message);
    res.status(500).send('Error en el servidor.');
  }
});


module.exports = router;