exports.generarReporte = (req, res) => {
    try {
        const { datos } = req.body;

        // Aquí solo retornamos los datos para simular un "reporte"
        res.status(200).json({
            message: 'Reporte generado correctamente.',
            reporte: datos
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al generar el reporte.',
            error
        });
    }
};
