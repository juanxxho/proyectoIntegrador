const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const tareaRoutes = require("./routes/tareaRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3005;

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Conexión a la base de datos MySQL con Sequelize establecida ✅"
    );

    // Aquí sincronizamos los modelos con la base de datos
    return sequelize.sync();
  })
  .then(() => {
    app.use("/", tareaRoutes);

    app.listen(PORT, () => {
      console.log(`Tareas-Service corriendo en el puerto ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error(
      "Error de conexión o sincronización a la base de datos:",
      err
    );
  });
