const mongoose = require('mongoose');

const ModelProduct = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('Modelo', ModelProduct);
