const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/authControlador');

// POST /api/auth/register
router.post('/register', registrarUsuario);

// POST /api/auth/login
router.post('/login', loginUsuario);

module.exports = router;
