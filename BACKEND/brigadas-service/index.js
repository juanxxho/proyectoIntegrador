const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db"); // Conexión a MySQL
const expertosDB = require("./config/dbExpertos"); // Conexión a PostgreSQL
const brigadaRoutes = require("./routes/brigadaRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión y sincronización de la base de datos MySQL
db.sync({ force: false }) // Cambié a `force: false` para no eliminar datos existentes
  .then(() => console.log("Base de datos MySQL sincronizada ✅"))
  .catch((err) =>
    console.error("Error al sincronizar la base de datos MySQL:", err)
  );

// Conexión y sincronización de la base de datos PostgreSQL (expertos)
expertosDB
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos PostgreSQL establecida ✅");
    // Aquí puedes sincronizar los modelos de expertos, si estás usando Sequelize
    expertosDB.sync(); // Descomenta si usas Sequelize para manejar PostgreSQL
  })
  .catch((err) =>
    console.error("Error al conectar a la base de datos PostgreSQL:", err)
  );

// Rutas
app.use("/", brigadaRoutes);

// Puerto
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Brigada-Service corriendo en el puerto ${PORT} 🚀`);
});
