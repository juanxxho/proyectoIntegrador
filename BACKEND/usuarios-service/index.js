const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/db');

dotenv.config();
const app = express();
app.use(express.json());

sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida ✅');
        return sequelize.sync();  // sincroniza modelos
    })
    .then(() => {
        console.log('Modelos sincronizados correctamente 🗃️');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

app.use('/api/usuarios', userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Usuarios-Service corriendo en el puerto ${PORT} 🚀`);
});
