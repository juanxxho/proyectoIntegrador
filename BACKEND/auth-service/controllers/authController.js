const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const axios = require('axios'); // Importamos axios para hacer la consulta a la API de brigadas

exports.register = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Por favor, ingresa todos los campos.' });
    }

    const rolesValidos = ['administrador', 'jefe de brigada', 'botanico', 'auxiliar', 'coinvestigador'];
    if (!rolesValidos.includes(role)) {
        return res.status(400).json({ message: 'Rol no válido.' });
    }

    try {
        // Solo validamos contra el microservicio si NO es administrador
        if (role !== 'administrador') {
            const response = await axios.get(`http://gateway/brigadas/experto/correo/${encodeURIComponent(email)}`);

            if (!response.data || response.data.rol !== role) {
                return res.status(400).json({ message: 'El correo no está asociado con un experto o el rol no coincide.' });
            }
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        await userModel.createUser(email, hashedPassword, role);
        return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, ingresa ambos campos.' });
    }

    try {
        const user = await userModel.findUserByEmail(email);  // Cambié username por email
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },  // Cambié username por email
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

