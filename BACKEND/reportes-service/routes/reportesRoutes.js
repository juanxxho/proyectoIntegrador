const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const reportesController = require('../controllers/reportesController');

router.post(
    '/generar',
    verifyToken,
    verifyRole(['administrador', 'jefe_brigada']),
    reportesController.generarReporte
);

module.exports = router;
