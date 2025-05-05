const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Expertos = require('./expertos');  // Asegúrate de tener el modelo de Expertos

const Brigada = db.define('Brigada', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jefe_brigada_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    botanico_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    auxiliar_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    coinvestigador_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'sin_asignar'
    }
}, {
    tableName: 'brigadas',
    timestamps: false
});

module.exports = Brigada;
