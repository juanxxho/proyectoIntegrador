const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const muestrasRoutes = require("./routes/muestrasRoutes");
const sequelize = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión y sincronización con la base de datos usando Sequelize
// Conexión y sincronización con la base de datos usando Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos MySQL (muestras-service) ✅");
    return sequelize.sync({ force: true }); // 🔥 Forzar recreación de tablas
  })
  .then(() => {
    console.log("Tablas sincronizadas con force:true (muestras-service) 🗄️");
  })
  .catch((err) => {
    console.error("Error de conexión a la BD:", err);
  });

app.use("/", muestrasRoutes);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Muestras-Service corriendo en el puerto ${PORT} 🚀`);
});
