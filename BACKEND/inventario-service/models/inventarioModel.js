const { DataTypes } = require('sequelize');
const db = require('../config/db');

// Tabla: inventarios
const Inventario = db.define('Inventario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    investigacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_material: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'inventarios',
    timestamps: false
});

module.exports = Inventario;
