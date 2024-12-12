const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,  
        required: true
    },
    subcategoria: {
        type: String
    }
});
//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

module.exports = mongoose.model('Producto', productoSchema);
