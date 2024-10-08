const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/database');
const PORT = process.env.PORT || 5000;

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/authRuta'));
app.use('/api/productos', require('./routes/rutas'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
