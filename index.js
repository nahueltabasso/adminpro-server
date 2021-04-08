const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors')
// const bodyParser = require('body-parser');
require('dotenv').config();

// Crear el servidor express
const app = express();

// Configuracion de CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Paths
app.use('/api/usuario', require('./routes/usuarioRoutes'));
app.use('/api/login', require('./routes/authRoutes'));

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});