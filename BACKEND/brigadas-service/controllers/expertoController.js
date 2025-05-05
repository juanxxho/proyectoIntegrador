const expertoService = require('../servicios/expertoService');

async function obtenerExpertosPorRol(req, res) {
    const rol = req.params.rol;

    try {
        // Llamada al servicio para obtener los expertos por rol
        const respuesta = await expertoService.obtenerExpertosPorRol(rol);

        // Verificar si la respuesta es correcta
        if (!respuesta.ok) {
            return res.status(404).json({ message: respuesta.error });
        }

        // Si todo está bien, devolver los expertos encontrados
        return res.json({ expertos: respuesta.expertos });
    } catch (error) {
        console.error('Error al obtener expertos por rol:', error);
        return res.status(500).json({ message: 'Hubo un error al obtener los expertos.' });
    }
}

async function obtenerExpertoPorCorreo(req, res) {
    const email = req.params.email;

    try {
        const respuesta = await expertoService.obtenerExpertoPorCorreo(email);

        if (!respuesta.ok) {
            return res.status(404).json({ message: respuesta.error });
        }

        return res.json(respuesta.experto);
    } catch (error) {
        console.error('Error al obtener experto por correo:', error);
        return res.status(500).json({ message: 'Hubo un error al obtener el experto.' });
    }
}

module.exports = {
    obtenerExpertosPorRol,
    obtenerExpertoPorCorreo // 👈 Exporta la función nueva
};
