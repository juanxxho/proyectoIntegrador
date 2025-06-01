const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/crear", verifyToken, tareaController.createTarea);
router.get("/", verifyToken, tareaController.getAllTareas);
router.put("/:id", verifyToken, tareaController.updateEstadoTarea);
router.get(
  "/investigacion/:id",
  verifyToken,
  tareaController.getTareasPorInvestigacion
);
module.exports = router;
