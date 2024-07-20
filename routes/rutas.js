const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/controlador');

// GET /api/productos
router.get('/', obtenerProductos);

// POST /api/productos
router.post('/', auth, crearProducto);

// PUT /api/productos/:id
router.put('/:id', auth, actualizarProducto);

// DELETE /api/productos/:id
router.delete('/:id', auth, eliminarProducto);

module.exports = router;
