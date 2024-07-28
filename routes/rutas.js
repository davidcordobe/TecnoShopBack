
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/controlador');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas protegidas
router.post('/crear', authMiddleware, upload.single('imagen'), crearProducto);
router.get('/', authMiddleware, obtenerProductos);
router.put('/:id', authMiddleware, upload.single('imagen'), actualizarProducto);
router.delete('/:id', authMiddleware, eliminarProducto);

module.exports = router;