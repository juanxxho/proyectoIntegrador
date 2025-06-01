const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const morgan = require("morgan");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/", authRoutes);

// Conexión y sincronización de la base de datos
db.authenticate()
  .then(() => {
    console.log(
      "Conexión a la base de datos MySQL con Sequelize establecida ✅"
    );
    return db.sync({ force: false }); // ⚠️ Esto elimina y recrea las tablas
    // Esto crea las tablas si no existen
  })
  .then(() => {
    console.log("Tablas sincronizadas correctamente 🗄️");
    // Ahora sí arrancamos el servidor
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Auth-Service corriendo en el puerto ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar o sincronizar la base de datos:", err);
  });
