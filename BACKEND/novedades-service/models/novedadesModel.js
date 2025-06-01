const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Novedad = sequelize.define(
  "Novedad",
  {
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    brigada_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "novedades",
    timestamps: false,
  }
);

module.exports = Novedad;
