const Producto = require('../models/modelos');

// Crear Producto
const crearProducto = async (req, res) => {
    const { nombre, precio, descripcion, categoria, subcategoria, imagen } = req.body;  // imagen vendrá como URL

    try {
        const nuevoProducto = new Producto({ nombre, precio, descripcion, imagen, categoria, subcategoria });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Obtener Productos (Protegido)
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

// Obtener Productos Públicos (sin autenticación)
const obtenerProductosPublicos = async (req, res) => {
    try {
        const productos = await Producto.find(); // Puedes agregar filtros si es necesario
        if (!productos) {
            return res.status(404).json({ message: 'Productos no encontrados' });
        }
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos públicos', error });
    }
};

// Eliminar Producto
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Elimina el producto de la base de datos (ya no hay necesidad de eliminar imágenes locales)
        await Producto.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

// Actualizar Producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, categoria, subcategoria, imagen } = req.body; // imagen vendrá como URL

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // No es necesario eliminar imágenes locales, solo actualizamos la URL
        producto.nombre = nombre;
        producto.precio = precio;
        producto.descripcion = descripcion;
        producto.categoria = categoria;
        producto.subcategoria = subcategoria;
        if (imagen) {
            producto.imagen = imagen; // Actualizamos la URL de la imagen
        }

        await producto.save();
        res.json(producto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

};
const Producto = require('../models/Producto'); // Asegúrate de importar el modelo Producto

const actualizarPreciosPorCategoria = async (req, res) => {
    const { categoria, porcentaje } = req.body;

    // Validación de datos
    if (isNaN(porcentaje) || porcentaje <= 0) {
        return res.status(400).json({ message: 'El porcentaje debe ser un número válido mayor que 0.' });
    }
    
    if (!categoria) {
        return res.status(400).json({ message: 'La categoría es requerida.' });
    }

    try {
        // Actualizar los precios de los productos en la categoría especificada
        const productosActualizados = await Producto.updateMany(
            { categoria }, // Filtrar productos por la categoría
            [
                { 
                    $set: { 
                        precio: { 
                            $round: [{ $multiply: ["$precio", (1 + porcentaje / 100)] }, 2] 
                        }
                    }
                }
            ]
        );

        if (productosActualizados.modifiedCount === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para actualizar.' });
        }

        // Obtener los productos actualizados
        const productos = await Producto.find({ categoria });

        res.status(200).json({
            message: 'Precios actualizados correctamente.',
            productos
        });
    } catch (err) {
        console.error('Error al actualizar precios:', err);
        res.status(500).json({ message: 'Hubo un problema al actualizar los precios. Intente nuevamente más tarde.' });
    }
};





module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductosPublicos,
    actualizarProducto,
    eliminarProducto,
    actualizarPreciosPorCategoria
};
