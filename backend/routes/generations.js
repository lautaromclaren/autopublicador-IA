// backend/routes/generations.js

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const authMiddleware = require('../middleware/auth'); // Importamos nuestro guardián
const Generation = require('../models/Generation'); // Importamos nuestro nuevo modelo

const openai = new OpenAI();

// =============================================================
//  RUTA PROTEGIDA PARA GENERAR CONTENIDO: POST /api/generations
// =============================================================
router.post('/', authMiddleware, async (req, res) => {
  // Gracias al middleware, tenemos acceso a req.user.id con el ID del usuario autenticado
  const userId = req.user.id;
  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ message: 'La idea es requerida.' });
  }

  console.log(`Petición de ${userId}. Generando 3 variaciones para: "${idea}"`);

  try {
    // 1. LLAMADA A LA API DE OPENAI (sin cambios)
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un experto en copywriting para redes sociales..." },
        { role: "user", content: `Genera 3 variaciones únicas...para: "${idea}". Separa cada variación con "|||".` }
      ],
    });

    const rawContent = completion.choices[0].message.content;
    const variations = rawContent.split('|||').map(text => text.trim()).filter(text => text); // .filter(text => text) elimina strings vacíos

    // 2. ¡NUEVO! GUARDAR LA GENERACIÓN EN LA BASE DE DATOS
    const newGeneration = new Generation({
      user: userId,
      prompt: idea,
      variations: variations
    });

    await newGeneration.save();
    console.log(`Generación guardada en la BD para el usuario ${userId}`);

    // 3. ENVIAR LA RESPUESTA AL FRONTEND
    res.status(201).json({
      message: 'Contenido generado y guardado con éxito.',
      generatedVariations: variations
    });

  } catch (error) {
    console.error("Error en la generación:", error);
    res.status(500).json({ message: 'Error al generar el contenido.' });
  }
});

module.exports = router;