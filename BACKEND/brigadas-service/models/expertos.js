const { DataTypes } = require('sequelize');
const expertosDB = require('../config/dbExpertos');

const Expertos = expertosDB.define('Expertos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {  // Nuevo campo agregado
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Para garantizar que cada correo sea único
    }
}, {
    tableName: 'expertos',
    timestamps: false  // Evita que Sequelize agregue columnas como createdAt y updatedAt
});

module.exports = Expertos;
