const jwt = require('jsonwebtoken');

// Middleware para verificar si el usuario está autenticado
exports.verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado. No se ha proporcionado un token.' });
    }

    // Eliminar el prefijo 'Bearer ' si existe
    const tokenWithoutBearer = token.split(' ')[1];

    try {
        // Verificar y decodificar el token
        const decoded = await jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        // Guardar la información del usuario decodificada en el objeto req para acceso en rutas posteriores
        req.user = decoded;
        next(); // Pasar al siguiente middleware o controlador
    } catch (err) {
        return res.status(403).json({ message: 'Token no válido.' });
    }
};

// Middleware para verificar el rol del usuario
exports.verifyRole = (roles) => {
    return (req, res, next) => {
        // Verificar si el usuario tiene el rol requerido
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Acceso denegado. El rol '${req.user.role}' no tiene permiso para acceder a esta ruta. Se requiere uno de los siguientes roles: ${roles.join(', ')}.`
            });
        }
        next();
    };
};
