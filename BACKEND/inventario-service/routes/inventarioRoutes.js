const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

router.get('/', inventarioController.listarInventarios);
router.post('/', inventarioController.crearInventario);
router.put('/:id', inventarioController.actualizarInventario);
router.delete('/:id', inventarioController.eliminarInventario);

module.exports = router;
