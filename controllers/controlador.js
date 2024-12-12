const Producto = require('../models/modelos');

// Crear un producto
const crearProducto = async (req, res) => {
    try {
        // Validaciones: Verifica que los campos requeridos estén presentes
        const { nombre, descripcion, precio, categoria, subcategoria, imagen } = req.body;
        if (!nombre || !descripcion || !precio || !categoria || !subcategoria || !imagen) {
            return res.status(400).json({ message: 'Por favor, completa todos los campos requeridos.' });
        }

        // Crear el producto
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
        // Obtener todos los productos
        const productos = await Producto.find() || [];
        res.status(200).json(productos);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).json({ message: 'Error al obtener los productos.', productos: [] });
    }
};

// Obtener productos públicos (p.ej., visibles en el frontend)
const obtenerProductosPublicos = async (req, res) => {
    try {
        // Obtener solo los productos que estén marcados como visibles
        const productos = await Producto.find({ visible: true });
        res.status(200).json(productos);
    } catch (err) {
        console.error('Error al obtener los productos públicos:', err);
        res.status(500).json({ message: 'Error al obtener los productos públicos.' });
    }
};

// Actualizar un producto por ID
const actualizarProducto = async (req, res) => {
    const { id } = req.params;

    // Validaciones: Verifica que el ID esté presente y sea válido
    if (!id) {
        return res.status(400).json({ message: 'ID del producto no proporcionado.' });
    }

    try {
        // Actualizar el producto
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

    // Validaciones: Verifica que el ID esté presente
    if (!id) {
        return res.status(400).json({ message: 'ID del producto no proporcionado.' });
    }

    try {
        // Eliminar el producto
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

// Actualizar precios globalmente (porcentaje)
const actualizarPreciosGlobalmente = async (req, res) => {
    const porcentaje = parseFloat(req.body.porcentaje); // Convertimos el porcentaje a número

    // Validación: Verifica que el porcentaje sea un número válido
    if (isNaN(porcentaje) || porcentaje <= 0) {
        return res.status(400).json({ message: 'El porcentaje debe ser un número mayor que 0.' });
    }

    try {
        // Actualizar los precios de todos los productos de manera masiva
        const resultado = await Producto.updateMany({}, [
            { $set: { precio: { $round: [{ $multiply: ["$precio", (1 + porcentaje / 100)] }, 2] } } }
        ]);

        if (resultado.modifiedCount === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para actualizar.' });
        }

        // Obtener los productos actualizados
        const productosActualizados = await Producto.find();

        if (!productosActualizados || productosActualizados.length === 0) {
            return res.status(404).json({ message: 'No se pudieron obtener los productos actualizados.' });
        }

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
