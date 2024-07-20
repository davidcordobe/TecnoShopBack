const Producto = require('../models/modelos');

// Crear un nuevo producto
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

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;
    const imagen = req.file ? req.file.path : null;  

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
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

// Eliminar un producto
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoEliminado = await Producto.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Opcional: Eliminar el archivo de imagen si existe
        if (productoEliminado.imagen) {
            const fs = require('fs');
            fs.unlinkSync(productoEliminado.imagen);
        }

        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto
};
