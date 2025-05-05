const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fotosRoutes = require('./routes/fotosRoutes');
const db = require('./config/db');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Carpeta pública

// Asegurarse de que la carpeta 'uploads' exista
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Conexión a la base de datos
db.authenticate()
    .then(() => console.log('Conexión a la base de datos MySQL (fotos-service) ✅'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

// Rutas
app.use('/', fotosRoutes);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
    console.log(`Fotos-Service corriendo en el puerto ${PORT} 🚀`);
});
