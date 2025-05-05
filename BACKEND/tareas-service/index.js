const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const tareaRoutes = require('./routes/tareaRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

sequelize.authenticate()
    .then(() => console.log('Conexión a la base de datos MySQL con Sequelize establecida ✅'))
    .catch(err => console.error('Error de conexión a la base de datos:', err));

app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Tareas-Service corriendo en el puerto ${PORT} 🚀`);
});
