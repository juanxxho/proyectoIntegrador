const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const fotosController = require('../controllers/fotosController');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post(
    '/',
    verifyToken,
    verifyRole(['auxiliar_tecnico']),
    upload.single('foto'),
    fotosController.subirFoto
);

router.get('/', verifyToken, fotosController.obtenerFotos);

module.exports = router;
