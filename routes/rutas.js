const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
    crearProducto,
    obtenerProductos,
    obtenerProductosPublicos,
    actualizarProducto,
    eliminarProducto,
} = require('../controllers/controlador');
const actualizarTodosLosPrecios = require('../controllers/aumentartodoslosprecios.js');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas protegidas (requieren autenticación)
router.post('/crear', authMiddleware, upload.single('imagen'), crearProducto); // Crear producto
router.get('/', authMiddleware, obtenerProductos); // Obtener productos
router.put('/precios/actualizar-todos', authMiddleware, actualizarTodosLosPrecios); // Actualización masiva de precios
router.put('/actualizar/:id', authMiddleware, actualizarProducto); // Actualizar producto individual por ID
router.delete('/:id', authMiddleware, eliminarProducto); // Eliminar producto por ID

// Ruta pública para obtener productos
router.get('/publicos', obtenerProductosPublicos); // Obtener productos sin autenticación

module.exports = router;
