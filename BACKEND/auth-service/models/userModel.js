const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Aquí importamos nuestra conexión Sequelize

// Definimos el modelo de usuario
const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            "administrador",
            "jefe de brigada",
            "botanico",
            "auxiliar",
            "coinvestigador",
          ],
        ],
      },
    },
    id_ideam: {
      type: DataTypes.INTEGER,
      allowNull: true, // null para administradores
    },
  },
  {
    timestamps: false,
  }
);

// Métodos de interacción con la base de datos (usando Sequelize)
const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async (email, password, role, id_ideam = null) => {
  return await User.create({ email, password, role, id_ideam });
};

module.exports = {
  findUserByEmail,
  createUser,
};
