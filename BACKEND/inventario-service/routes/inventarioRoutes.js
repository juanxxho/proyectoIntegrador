const express = require("express");
const router = express.Router();
const inventarioController = require("../controllers/inventarioController");

router.get("/", inventarioController.listarInventarios);
router.post("/", inventarioController.crearInventario);
router.post("/crear-multiple", inventarioController.crearInventarioMultiple);
router.put("/:id", inventarioController.actualizarInventario);
router.delete("/:id", inventarioController.eliminarInventario);

module.exports = router;
