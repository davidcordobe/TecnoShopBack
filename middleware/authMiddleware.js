
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No hay token, permiso denegado' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de 'Bearer '

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token no es válido' });
    }
};

module.exports = auth;

