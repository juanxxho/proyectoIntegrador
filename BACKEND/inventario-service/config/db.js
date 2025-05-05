const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

sequelize.authenticate()
  .then(() => console.log('Conexión exitosa'))
  .catch(err => console.log('Error de conexión:', err));

// Sincronización de las tablas
sequelize.sync()
  .then(() => console.log('Tablas sincronizadas correctamente'))
  .catch(err => console.log('Error al sincronizar las tablas', err));


module.exports = sequelize;
