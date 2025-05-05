const { DataTypes } = require('sequelize');
const db = require('../config/db');  // Asegúrate que tu conexión esté bien configurada

const Investigacion = db.define('Investigacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendiente'
    },
    municipio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brigada_id: {
      type: DataTypes.INTEGER,  // Esto es correcto para tener el campo brigada_id
      allowNull: true, // Hacemos que pueda ser nulo (si no se asocia una brigada)
    }
}, {
    tableName: 'investigaciones',
    timestamps: false
});

module.exports = Investigacion;
