const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Configuración de la conexión
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql', // Usamos MySQL
    logging: false,   // Desactivar logs SQL si no los necesitas
});

module.exports = sequelize;
