const Novedad = require("../models/novedadesModel");

exports.crearNovedad = async (req, res) => {
  try {
    const { descripcion, fecha, brigada_id } = req.body;
    const resultado = await Novedad.create({ descripcion, fecha, brigada_id });
    res
      .status(201)
      .json({ message: "Novedad registrada correctamente.", resultado });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar la novedad.", error });
  }
};

exports.obtenerNovedades = async (req, res) => {
  try {
    const { brigada_id } = req.params;
    const novedades = await Novedad.findAll({ where: { brigada_id } });
    res.status(200).json(novedades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener novedades.", error });
  }
};
