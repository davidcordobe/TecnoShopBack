const Producto = require('../models/modelos');

const actualizarTodosLosPrecios = async (req, res) => {
    try {
        const { porcentaje } = req.body;

        if (!porcentaje || typeof porcentaje !== 'number' || porcentaje <= 0) {
            return res.status(400).json({ message: 'Porcentaje inválido.' });
        }

        const productos = await Producto.find();

        const productosActualizados = await Promise.all(
            productos.map(async (producto) => {
                const nuevoPrecio = parseFloat(
                    (producto.precio * (1 + porcentaje / 100)).toFixed(2)
                );

                return Producto.findByIdAndUpdate(
                    producto._id,
                    { precio: nuevoPrecio },
                    { new: true }
                );
            })
        );

        res.json({
            message: 'Precios actualizados con éxito.',
            productosActualizados,
        });
    } catch (error) {
        console.error('Error al actualizar precios:', error);
        res.status(500).json({ message: 'Error actualizando precios.' });
    }
};

// Exportar directamente la función
module.exports = actualizarTodosLosPrecios;
