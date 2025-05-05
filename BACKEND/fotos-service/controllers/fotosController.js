const Foto = require('../models/fotosModel');

exports.subirFoto = async (req, res) => {
    try {
        const { descripcion, fecha, auxiliar_id } = req.body;
        const filename = req.file?.filename;

        if (!filename || !descripcion || !fecha || !auxiliar_id) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios y se debe subir una foto.' });
        }

        const resultado = await Foto.create({ filename, descripcion, fecha, auxiliar_id });
        res.status(201).json({ message: 'Foto subida correctamente.', resultado });
    } catch (error) {
        res.status(500).json({ message: 'Error al subir la foto.', error });
    }
};

exports.obtenerFotos = async (_req, res) => {
    try {
        const fotos = await Foto.findAll();
        res.status(200).json(fotos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las fotos.', error });
    }
};
