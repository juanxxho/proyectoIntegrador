const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const expertosDB = new Sequelize(
  process.env.EXPERTOS_DB_NAME,
  process.env.EXPERTOS_DB_USER,
  process.env.EXPERTOS_DB_PASSWORD,
  {
    host: process.env.EXPERTOS_DB_HOST,
    dialect: 'postgres',
    port: process.env.EXPERTOS_DB_PORT || 5432, // por si cambias el puerto en el docker
    logging: false, // opcional, para que no muestre logs SQL en consola
  }
);
// Sincronización de la base de datos de expertos
async function init() {
  try {
    await expertosDB.sync({ force: false });
    console.log('Tablas de Expertos sincronizadas');
  } catch (error) {
    console.error('Error al sincronizar la base de datos de expertos:', error);
  }
}

init();
module.exports = expertosDB;
