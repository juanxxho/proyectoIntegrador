const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Tarea = sequelize.define(
  "Tarea",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_investigacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo_tarea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asignado_a: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("Pendiente", "En progreso", "Completada"),
      allowNull: false,
    },
  },
  {
    tableName: "tareas",
    timestamps: false,
  }
);

module.exports = Tarea;
