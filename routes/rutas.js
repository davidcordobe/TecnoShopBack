
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
    crearProducto,
    obtenerProductos,
    obtenerProductosPublicos,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/controlador');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas protegidas (requieren autenticación)
router.post('/crear', authMiddleware, upload.single('imagen'), crearProducto);
router.get('/', authMiddleware, obtenerProductos);
router.put('/:id', authMiddleware, upload.single('imagen'), actualizarProducto);
router.delete('/:id', authMiddleware, eliminarProducto);

// Ruta pública para obtener productos
router.get('/publicos', obtenerProductosPublicos);  // Nueva ruta pública

module.exports = router;
