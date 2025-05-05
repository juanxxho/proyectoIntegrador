const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const reportesRoutes = require('./routes/reportesRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reportes', reportesRoutes);

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`Reportes-Service corriendo en el puerto ${PORT} 📄🚀`);
});
