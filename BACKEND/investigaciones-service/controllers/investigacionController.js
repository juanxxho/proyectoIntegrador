// investigacionController.js
const Investigacion = require('../models/investigacionModel');

const crearInvestigacion = async (req, res) => {
    try {
      const datos = req.body;
  
      const result = await Investigacion.create({
        nombre: datos.nombre,
        fecha_inicio: datos.fecha_inicio,
        fecha_fin: datos.fecha_fin,
        estado: datos.estado || 'pendiente',
        municipio: datos.municipio,
        departamento: datos.departamento,
        brigada_id: datos.brigada_id
      });
  
      res.status(201).json({ message: 'Investigación creada', result });
    } catch (error) {
      console.error('Error al crear investigación:', error); // importante para debug
      res.status(500).json({ error: error.message });
    }
  };
  

const listarInvestigaciones = async (req, res) => {
    try {
        const investigaciones = await Investigacion.findAll();
        res.status(200).json(investigaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const consultarInvestigacion = async (req, res) => {
    try {
        const id = req.params.id;
        const investigacion = await Investigacion.findByPk(id);
        if (investigacion) {
            res.status(200).json(investigacion);
        } else {
            res.status(404).json({ message: 'Investigación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const id = req.params.id;
        const { estado } = req.body;
        const result = await Investigacion.update({ estado }, { where: { id } });
        if (result[0] > 0) {
            res.status(200).json({ message: 'Estado actualizado', result });
        } else {
            res.status(404).json({ message: 'Investigación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const asignarBrigada = async (req, res) => {
    try {
      const id = req.params.id;
      const { brigada_id } = req.body;
  
      const result = await Investigacion.update(
        { brigada_id },
        { where: { id } }
      );
  
      if (result[0] > 0) {
        res.status(200).json({ message: 'Brigada asignada a investigación', result });
      } else {
        res.status(404).json({ message: 'Investigación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
    crearInvestigacion,
    listarInvestigaciones,
    consultarInvestigacion,
    cambiarEstado,
    asignarBrigada
};
