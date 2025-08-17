// backend/routes/facebook.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// =============================================================
//  RUTA PROTEGIDA PARA OBTENER GRUPOS: GET /api/facebook/groups
// =============================================================
router.get('/groups', authMiddleware, async (req, res) => {
  try {
    // 1. Buscamos al usuario autenticado en nuestra BD
    const user = await User.findById(req.user.id);

    // Verificamos si el usuario ha conectado su cuenta de Facebook (real o simulada)
    if (!user || !user.facebookAccessToken) {
      return res.status(400).json({ message: 'El usuario no ha conectado una cuenta de Facebook.' });
    }

    // --- MODO SIMULACIÓN ---
    // Por ahora, devolveremos una lista de grupos falsos para el desarrollo.
    const mockGroups = [
      { id: '1001', name: 'Grupo de Marketing Digital - Expertos' },
      { id: '1002', name: 'Emprendedores de Argentina 🇦🇷' },
      { id: '1003', name: 'Fans de la Tecnología y Gadgets' },
      { id: '1004', name: 'Clasificados de Compra/Venta (Córdoba)' },
      { id: '1005', name: 'Club de Lectura Nocturna' },
    ];

    console.log(`Modo Simulación: Devolviendo lista de grupos falsos para el usuario ${req.user.id}`);
    return res.json(mockGroups);

    /* --- CÓDIGO REAL PARA EL FUTURO (NO USAR AHORA) ---
    // Cuando la App de Meta esté aprobada, reemplazaremos la simulación con este código:
    const accessToken = user.facebookAccessToken;
    const response = await axios.get(`https://graph.facebook.com/me/groups`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,privacy' // Pedimos ID, nombre y privacidad del grupo
      }
    });

    res.json(response.data.data); // La API de Graph devuelve los datos en un campo "data"
    */

  } catch (error) {
    console.error('Error al obtener los grupos de Facebook:', error.response ? error.response.data : error.message);
    res.status(500).send('Error en el servidor al intentar obtener los grupos.');
  }
});

module.exports = router;