const express = require('express');
const router = express.Router();
const muestrasController = require('../controllers/muestrasController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, verifyRole(['botanico']), muestrasController.crearMuestra);
router.get('/', verifyToken, muestrasController.obtenerMuestras);

module.exports = router;
