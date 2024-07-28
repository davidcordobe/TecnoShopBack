const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Genera un timestamp como identificador único
        const uniqueSuffix = Date.now();
        const productName = req.body.nombre;
        const extname = path.extname(file.originalname);
        // Construye el nombre del archivo con el identificador único
        cb(null, `${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${uniqueSuffix}${extname}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;


