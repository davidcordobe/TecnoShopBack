const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModelo');

// Registro de usuario
const registrarUsuario = async (req, res) => {
    const { username, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ username });
        if (usuario) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        usuario = new Usuario({ username, password });

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        await usuario.save();

        // Crear y devolver el token
        const payload = { userId: usuario.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login de usuario
const loginUsuario = async (req, res) => {
    const { username, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ username });
        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const esMatch = await bcrypt.compare(password, usuario.password);
        if (!esMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Crear y devolver el token
        const payload = { userId: usuario.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario
};
