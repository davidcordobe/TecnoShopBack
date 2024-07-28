const fs = require('fs');
const path = require('path');
const Producto = require('../models/modelos');

const crearProducto = async (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    const imagen = req.file ? req.file.path : null;

    try {
        const nuevoProducto = new Producto({ nombre, precio, descripcion, imagen });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        if (!productos) {
            return res.status(404).json({ message: 'Productos no encontrados' });
        }
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};



const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received ID for deletion:', id); // Verifica que el ID sea el esperado
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Elimina la imagen asociada si existe
        if (producto.imagen) {
            const imagePath = path.join(__dirname, '..', producto.imagen);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        await Producto.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Failed to delete product', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;
    const imagen = req.file ? req.file.path : null;

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Elimina la imagen antigua si se sube una nueva
        if (imagen && producto.imagen) {
            const oldImagePath = path.join(__dirname, '..', producto.imagen);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error('Failed to delete old image:', err);
            });
        }

        producto.nombre = nombre;
        producto.precio = precio;
        producto.descripcion = descripcion;
        if (imagen) {
            producto.imagen = imagen;
        }
        await producto.save();

        res.json(producto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto
};
