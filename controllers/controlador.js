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
    const { id } = req.params;  // El id del producto a actualizar
    const { nombre, descripcion, precio, categoria, subcategoria, imagen } = req.body;

    if (!nombre || !descripcion || !precio || !imagen) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Actualiza los campos del producto
        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.categoria = categoria;
        producto.subcategoria = subcategoria;
        producto.imagen = imagen;

        await producto.save();
<<<<<<< HEAD
        res.status(200).json(producto);  // Responde con el producto actualizado
=======
        res.json(producto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

};


const actualizarTodosLosPrecios = async (req, res) => {
    try {
        const { porcentaje } = req.body;

        // Validar el porcentaje
        if (!porcentaje || typeof porcentaje !== 'number' || porcentaje <= 0) {
            return res.status(400).json({ message: 'Porcentaje inválido.' });
        }

        // Obtener y actualizar todos los productos
        const productos = await Producto.find();

        const productosActualizados = await Promise.all(
            productos.map(async (producto) => {
                // Calcular y redondear el nuevo precio
                const nuevoPrecio = Math.ceil(
                    (producto.precio * (1 + porcentaje / 100)) / 10
                ) * 10;

                // Actualizar el precio y guardar el producto
                return Producto.findByIdAndUpdate(
                    producto._id,
                    { precio: nuevoPrecio },
                    { new: true } // Devolver el documento actualizado
                );
            })
        );

        // Enviar respuesta con los productos actualizados
        res.json({
            message: 'Precios actualizados con éxito.',
            productosActualizados,  // Enviar los productos actualizados correctamente
        });
>>>>>>> d6cca905c4d01f0bc50dc3ca4d3d0c4e87c8592d
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};



module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductosPublicos,
    actualizarProducto,
    eliminarProducto
};
