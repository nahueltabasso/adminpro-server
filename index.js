const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors')
require('dotenv').config();

// Crear el servidor express
const app = express();

// Configuracion de CORS
app.use(cors());

// Base de datos
dbConnection();

// Paths
app.get('/', (request, response) => {
    response.json({
        ok: true,
        msg: 'Hola Mundo'
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});