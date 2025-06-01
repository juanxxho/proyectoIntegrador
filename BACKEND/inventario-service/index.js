const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const morgan = require("morgan");
const Inventario = require("./models/inventarioModel");
const inventarioRoutes = require("./routes/inventarioRoutes"); // <-- Aquí lo importas

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Montar las rutas
app.use("/", inventarioRoutes); // <-- Aquí las usas

// Conexión y sincronización de la base de datos
db.authenticate()
  .then(() => {
    console.log(
      "Conexión a la base de datos MySQL con Sequelize establecida ✅"
    );
    return db.sync({ force: true }); // 🔥 Esto fuerza la recreación de las tablas
  })
  .then(() => {
    console.log("Tablas sincronizadas con force:true correctamente 🗄️");
    const PORT = process.env.PORT || 3010;
    app.listen(PORT, () => {
      console.log(`Inventory-Service corriendo en el puerto ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar o sincronizar la base de datos:", err);
  });
