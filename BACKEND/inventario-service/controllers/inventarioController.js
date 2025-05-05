const Inventario = require('../models/inventarioModel');

// Listar todos los inventarios
const listarInventarios = async (req, res) => {
  try {
    const inventarios = await Inventario.findAll();
    res.json(inventarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los inventarios' });
  }
};

// Crear un nuevo inventario
const crearInventario = async (req, res) => {
    try {
      const { investigacion_id, nombre_material, cantidad, observaciones } = req.body;
      const nuevoInventario = await Inventario.create({
        investigacion_id,
        nombre_material,
        cantidad,
        observaciones,
      });
      res.status(201).json(nuevoInventario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el inventario' });
    }
  };
  

// Actualizar un inventario
const actualizarInventario = async (req, res) => {
    try {
      const { id } = req.params;
      const { investigacion_id, nombre_material, cantidad, observaciones } = req.body;
  
      const inventario = await Inventario.findByPk(id);
      if (!inventario) {
        return res.status(404).json({ error: 'Inventario no encontrado' });
      }
  
      inventario.investigacion_id = investigacion_id;
      inventario.nombre_material = nombre_material;
      inventario.cantidad = cantidad;
      inventario.observaciones = observaciones;
      await inventario.save();
  
      res.json(inventario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar el inventario' });
    }
  };
  

// Eliminar un inventario
const eliminarInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const inventario = await Inventario.findByPk(id);
    if (!inventario) {
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    await inventario.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el inventario' });
  }
};

module.exports = {
  listarInventarios,
  crearInventario,
  actualizarInventario,
  eliminarInventario,
};
