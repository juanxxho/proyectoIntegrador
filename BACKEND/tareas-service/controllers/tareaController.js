const Tarea = require("../models/tareaModel");

exports.createTarea = async (req, res) => {
  const {
    id_investigacion,
    tipo_tarea,
    asignado_a,
    fecha_inicio,
    fecha_fin,
    estado,
  } = req.body;

  if (!id_investigacion) {
    return res.status(400).json({ message: "Falta id_investigacion" });
  }

  try {
    const result = await Tarea.create({
      id_investigacion,
      tipo_tarea,
      asignado_a,
      fecha_inicio,
      fecha_fin,
      estado,
    });

    res.status(201).json({ message: "Tarea creada exitosamente", result });
  } catch (error) {
    console.error("Error creando tarea:", error);
    res
      .status(500)
      .json({ message: "Error al crear la tarea", error: error.message });
  }
};

exports.getAllTareas = async (_req, res) => {
  try {
    const tareas = await Tarea.findAll();
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tareas", error });
  }
};

exports.updateEstadoTarea = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const result = await Tarea.update({ estado }, { where: { id } });
    res.status(200).json({ message: "Estado de tarea actualizado", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el estado de la tarea", error });
  }
};

exports.getTareasPorInvestigacion = async (req, res) => {
  const { id } = req.params;
  try {
    const tareas = await Tarea.findAll({ where: { id_investigacion: id } });
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tareas", error });
  }
};
