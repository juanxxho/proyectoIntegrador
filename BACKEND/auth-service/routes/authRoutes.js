const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Rutas públicas (sin autenticación)
router.post('/register', authController.register);  // Registrar usuario
router.post('/login', authController.login);        // Login de usuario

// Rutas protegidas (requieren autenticación y rol adecuado)
router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Perfil de usuario', user: req.user });
});

// Ruta protegida solo para administradores
router.get('/admin-dashboard', verifyToken, verifyRole(['administrador']), (req, res) => {
    res.status(200).json({ message: 'Acceso a la vista de administrador', user: req.user });
});

// Ruta protegida solo para jefe de brigada
router.get('/jefe-dashboard', verifyToken, verifyRole(['jefe_brigada']), (req, res) => {
    res.status(200).json({ message: 'Acceso a la vista de jefe de brigada', user: req.user });
});

// Ruta protegida solo para botánicos
router.get('/botanico-dashboard', verifyToken, verifyRole(['botanico']), (req, res) => {
    res.status(200).json({ message: 'Acceso a la vista de botánico', user: req.user });
});

// Ruta protegida solo para auxiliares
router.get('/auxiliar-dashboard', verifyToken, verifyRole(['auxiliar']), (req, res) => {
    res.status(200).json({ message: 'Acceso a la vista de auxiliar', user: req.user });
});

// Ruta protegida solo para coinvestigadores
router.get('/coinvestigador-dashboard', verifyToken, verifyRole(['coinvestigador']), (req, res) => {
    res.status(200).json({ message: 'Acceso a la vista de coinvestigador', user: req.user });
});

module.exports = router;
