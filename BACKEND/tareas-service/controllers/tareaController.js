const Tarea = require('../models/tareaModel');

exports.createTarea = async (req, res) => {
    const { nombre, miembroId, fechaLimite, estado } = req.body;

    try {
        const result = await Tarea.create({
            nombre,
            miembro_id: miembroId,
            fecha_limite: fechaLimite,
            estado
        });
        res.status(201).json({ message: 'Tarea creada exitosamente', result });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea', error });
    }
};

exports.getAllTareas = async (_req, res) => {
    try {
        const tareas = await Tarea.findAll();
        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas', error });
    }
};

exports.updateEstadoTarea = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const result = await Tarea.update(
            { estado },
            { where: { id } }
        );
        res.status(200).json({ message: 'Estado de tarea actualizado', result });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado de la tarea', error });
    }
};
