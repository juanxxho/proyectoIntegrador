const express = require("express");
const router = express.Router();
const brigadaController = require("../controllers/brigadaController");
const expertoController = require("../controllers/expertoController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

// Crear brigada — solo ADMIN
router.post(
  "/",
  verifyToken,
  verifyRole(["administrador"]),
  brigadaController.createBrigada
);

// Obtener todas las brigadas — cualquier usuario autenticado
router.get("/", verifyToken, brigadaController.getAllBrigadas);

// Obtener brigada por ID
router.get("/:id", verifyToken, brigadaController.getBrigadaById);

// Actualizar estado de brigada — solo ADMIN o Jefe de Brigada
router.put(
  "/:id/estado",
  verifyToken,
  verifyRole(["administrador", "jefe_brigada"]),
  brigadaController.updateBrigadaEstado
);

// Obtener expertos por rol — cualquier usuario autenticado
router.get(
  "/expertos/:rol",
  verifyToken,
  expertoController.obtenerExpertosPorRol
);
// Obtener experto por correo — usado por auth para validar
router.get("/experto/correo/:email", expertoController.obtenerExpertoPorCorreo);

router.get("/miembros/:id", verifyToken, brigadaController.getMiembrosBrigada);

module.exports = router;
