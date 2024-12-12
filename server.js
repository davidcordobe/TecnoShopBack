const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/database');
const PORT = process.env.PORT || 5000;

const app = express();

// Conectar a la base de datos
connectDB();

app.use(cors({
    origin: ['https://technoshopnc.com', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false, // No continuar con la preflight después de la respuesta
    optionsSuccessStatus: 204, // Respuesta exitosa para OPTIONS
}));


app.use(express.json());
// Rutas de la API
app.use('/api/auth', require('./routes/authRuta'));
app.use('/api/productos', require('./routes/rutas'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir archivos estáticos de React en producción
if (process.env.NODE_ENV === 'production') {
    // Sirve los archivos estáticos del build de React
    app.use(express.static(path.join(__dirname, 'build')));

    // Redirige todas las rutas a index.html para que React Router las maneje
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

// Iniciar el servidor
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
