// backend/routes/groupSets.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const GroupSet = require('../models/GroupSet'); // Importamos nuestro nuevo modelo

// --- OBTENER TODOS LOS CONJUNTOS DE UN USUARIO ---
// GET /api/groupsets
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sets = await GroupSet.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(sets);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor.');
  }
});

// --- CREAR UN NUEVO CONJUNTO DE GRUPOS ---
// POST /api/groupsets
router.post('/', authMiddleware, async (req, res) => {
  const { name, groups } = req.body;
  try {
    // Verificamos si ya existe un conjunto con el mismo nombre para este usuario
    const existingSet = await GroupSet.findOne({ user: req.user.id, name: name });
    if (existingSet) {
      return res.status(400).json({ message: 'Ya existe un conjunto con ese nombre.' });
    }

    const newSet = new GroupSet({
      name,
      groups,
      user: req.user.id
    });

    const savedSet = await newSet.save();
    res.status(201).json(savedSet);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor.');
  }
});

// --- ACTUALIZAR UN CONJUNTO EXISTENTE ---
// PUT /api/groupsets/:id
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, groups } = req.body;
  try {
    let set = await GroupSet.findById(req.params.id);
    if (!set) {
      return res.status(404).json({ message: 'Conjunto no encontrado.' });
    }
    // Verificamos que el usuario sea el dueño del conjunto
    if (set.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado.' });
    }

    set.name = name;
    set.groups = groups;
    const updatedSet = await set.save();
    res.json(updatedSet);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor.');
  }
});

// --- BORRAR UN CONJUNTO ---
// DELETE /api/groupsets/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const set = await GroupSet.findById(req.params.id);
    if (!set) {
      return res.status(404).json({ message: 'Conjunto no encontrado.' });
    }
    if (set.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado.' });
    }

    await GroupSet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conjunto eliminado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor.');
  }
});

module.exports = router;