const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Foto = db.define(
  "Foto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitud: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitud: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    investigacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    auxiliar_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "fotos",
    timestamps: false,
  }
);

module.exports = Foto;
