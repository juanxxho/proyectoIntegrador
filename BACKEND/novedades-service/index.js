const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const novedadesRoutes = require("./routes/novedadesRoutes");
const sequelize = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

sequelize
  .authenticate()
  .then(() =>
    console.log("Conexión a la base de datos MySQL (novedades-service) ✅")
  )
  .catch((err) => console.error("Error de conexión a la BD:", err));

sequelize
  .sync({ force: true }) // 🔥 Borra y recrea las tablas
  .then(() =>
    console.log("Modelo sincronizado con force:true (novedades-service) 🔄")
  )
  .catch((err) => console.error("Error al sincronizar modelos:", err));

app.use("/", novedadesRoutes);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Novedades-Service corriendo en el puerto ${PORT} 🚀`);
});
