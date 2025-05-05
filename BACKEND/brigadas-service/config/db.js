const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: console.log // Esto imprimirá los SQLs ejecutados
    }
);
// Sincronización de la base de datos de brigadas
async function init() {
    try {
      await db.sync({ force: false });  // No usar 'force: true' en producción para evitar la eliminación de datos
      console.log('Tablas de Brigadas sincronizadas');
    } catch (error) {
      console.error('Error al sincronizar la base de datos de brigadas:', error);
    }
  }
  
  init();
module.exports = db;
