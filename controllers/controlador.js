const Producto = require('../models/modelos');

// Función para actualizar los precios globalmente
const actualizarPreciosGlobalmente = async (req, res) => {
    const { porcentaje } = req.body; // El porcentaje de incremento del precio
    if (isNaN(porcentaje) || porcentaje <= 0) {
        return res.status(400).json({ message: 'El porcentaje debe ser un número mayor que 0.' });
    }

    try {
        // Obtener todos los productos
        const productos = await Producto.find();

        if (!productos || productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para actualizar.' });
        }

        // Actualizar los precios de todos los productos
        const productosActualizados = await Promise.all(
            productos.map(async (producto) => {
                const nuevoPrecio = producto.precio * (1 + porcentaje / 100); // Calculamos el nuevo precio
                producto.precio = parseFloat(nuevoPrecio.toFixed(2)); // Convertimos a número y redondeamos a dos decimales
                return producto.save(); // Guardamos el producto actualizado
            })
        );

        res.status(200).json({
            message: 'Precios actualizados correctamente.',
            productos: productosActualizados
        });
    } catch (err) {
        console.error('Error al actualizar los precios:', err);
        res.status(500).json({ message: 'Hubo un problema al actualizar los precios.' });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductosPublicos,
    actualizarProducto,
    eliminarProducto,
    actualizarPreciosGlobalmente // Añadir la nueva función al exportar
};
