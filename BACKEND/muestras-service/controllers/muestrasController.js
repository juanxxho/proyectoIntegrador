const muestrasModel = require('../models/muestrasModel');

exports.crearMuestra = async (req, res) => {
    try {
        const { codigo, especie, ubicacion, fecha, botanico_id } = req.body;
        const resultado = await muestrasModel.createMuestra(codigo, especie, ubicacion, fecha, botanico_id);
        res.status(201).json({ message: 'Muestra registrada correctamente.', resultado });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la muestra.', error });
    }
};

exports.obtenerMuestras = async (_req, res) => {
    try {
        const muestras = await muestrasModel.getAllMuestras();
        res.status(200).json(muestras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las muestras.', error });
    }
};
