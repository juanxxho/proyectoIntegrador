const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Muestra = sequelize.define('Muestra', {
    codigo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    especie: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    botanico_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'muestras',
    timestamps: false
});

const createMuestra = (codigo, especie, ubicacion, fecha, botanico_id) => {
    return Muestra.create({ codigo, especie, ubicacion, fecha, botanico_id });
};

const getAllMuestras = () => {
    return Muestra.findAll();
};

module.exports = {
    Muestra,
    createMuestra,
    getAllMuestras
};
