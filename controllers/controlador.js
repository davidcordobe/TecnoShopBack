const Producto = require('../models/modelos');

// Crear un producto
const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (err) {
        console.error('Error al crear el producto:', err);
        res.status(500).json({ message: 'Error al crear el producto.' });
    }
};

// Obtener todos los productos (admin)
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).json({ message: 'Error al obtener los productos.' });
    }
};

// Obtener productos públicos (p.ej., visibles en el frontend)
const obtenerProductosPublicos = async (req, res) => {
    try {
        const productos = await Producto.find({ visible: true }); // Suponiendo que tienes un campo "visible"
        res.status(200).json(productos);
    } catch (err) {
        console.error('Error al obtener los productos públicos:', err);
        res.status(500).json({ message: 'Error al obtener los productos públicos.' });
    }
};

// Actualizar un producto por ID
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.status(200).json(productoActualizado);
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ message: 'Error al actualizar el producto.' });
    }
};

// Eliminar un producto por ID
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoEliminado = await Producto.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).json({ message: 'Error al eliminar el producto.' });
    }
};

// Actualizar precios globalmente
const actualizarPreciosGlobalmente = async (req, res) => {
    const porcentaje = parseFloat(req.body.porcentaje); // Convertimos el porcentaje a número
    if (isNaN(porcentaje) || porcentaje <= 0) {
        return res.status(400).json({ message: 'El porcentaje debe ser un número mayor que 0.' });
    }

    try {
        // Actualizar los precios de todos los productos de manera masiva
        await Producto.updateMany({}, [
            { $set: { precio: { $round: [{ $multiply: ["$precio", (1 + porcentaje / 100)] }, 2] } } }
        ]);

        // Obtener los productos actualizados
        const productosActualizados = await Producto.find();

        res.status(200).json({
            message: 'Precios actualizados correctamente.',
            productos: productosActualizados
        });
    } catch (err) {
        console.error('Error al actualizar los precios:', err);
        res.status(500).json({ message: 'Hubo un problema al actualizar los precios. Intente nuevamente más tarde.' });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductosPublicos,
    actualizarProducto,
    eliminarProducto,
    actualizarPreciosGlobalmente
};