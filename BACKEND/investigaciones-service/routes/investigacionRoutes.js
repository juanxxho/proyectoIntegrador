// investigacionRoutes.js
const express = require('express');
const router = express.Router();
const investigacionController = require('../controllers/investigacionController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, verifyRole(['administrador']), investigacionController.crearInvestigacion);
router.get('/', verifyToken, investigacionController.listarInvestigaciones);
router.get('/:id', verifyToken, investigacionController.consultarInvestigacion);
router.put('/:id/estado', verifyToken, verifyRole(['administrador']), investigacionController.cambiarEstado);
router.put('/:id/asignar-brigada', verifyToken, verifyRole(['administrador']), investigacionController.asignarBrigada);


module.exports = router;
