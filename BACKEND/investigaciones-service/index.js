// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db'); // Aquí debes importar la configuración de Sequelize
const investigacionRoutes = require('./routes/investigacionRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
// Conexión a la base de datos
db.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos MySQL establecida ✅');

        // Aquí va el sync
        return db.sync({ force: true }); // Cambia a false o alter más adelante
    })
    .then(() => {
        console.log('Tablas sincronizadas con force: true 🧨✅');
    })
    .catch(err => {
        console.error('Error al conectar o sincronizar la base de datos:', err);
    });

// Rutas
app.use('/', investigacionRoutes);

// Puerto
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Investigacion-Service corriendo en el puerto ${PORT} 🚀`);
});
