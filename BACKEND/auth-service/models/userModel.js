const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Aquí importamos nuestra conexión Sequelize

// Definimos el modelo de usuario
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Asegura que el correo sea único
        validate: {
            isEmail: true, // Valida que sea un correo electrónico
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['administrador', 'jefe de brigada', 'botanico', 'auxiliar', 'coinvestigador']],
        },
    },
}, {
    timestamps: false,  // Desactivar la creación de campos de fecha (createdAt, updatedAt)
});


// Métodos de interacción con la base de datos (usando Sequelize)
const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

const createUser = async (email, password, role) => {
    return await User.create({ email, password, role });
};

module.exports = {
    findUserByEmail,
    createUser
};

