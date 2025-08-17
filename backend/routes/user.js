// backend/routes/user.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// =============================================================
//  RUTA PROTEGIDA PARA GUARDAR LA SELECCIÓN: POST /api/user/groups
// =============================================================
router.post('/groups', authMiddleware, async (req, res) => {
  // El frontend nos enviará un array de objetos de grupo en el body
  const { selectedGroups } = req.body;

  try {
    // Buscamos al usuario por su ID y actualizamos su campo 'selectedFacebookGroups'
    await User.findByIdAndUpdate(req.user.id, {
      selectedFacebookGroups: selectedGroups
    });

    res.json({ message: 'Selección de grupos guardada exitosamente.' });
  } catch (error) {
    console.error('Error al guardar la selección de grupos:', error);
    res.status(500).send('Error en el servidor.');
  }
});

module.exports = router;