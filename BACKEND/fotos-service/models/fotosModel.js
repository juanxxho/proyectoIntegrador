const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Foto = db.define('Foto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    auxiliar_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'fotos',
    timestamps: false
});

module.exports = Foto;
