const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Tarea = sequelize.define('Tarea', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    miembro_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_limite: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'tareas',
    timestamps: false
});

module.exports = Tarea;
