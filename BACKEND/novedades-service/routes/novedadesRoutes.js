const express = require('express');
const router = express.Router();
const novedadesController = require('../controllers/novedadesController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, novedadesController.crearNovedad);
router.get('/:brigada_id', verifyToken, novedadesController.obtenerNovedades);

module.exports = router;
