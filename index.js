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

// Directorio publico
app.use(express.static('public'));

// Paths
app.use('/api/login', require('./routes/authRoutes'));
app.use('/api/usuario', require('./routes/usuarioRoutes'));
app.use('/api/hospital', require('./routes/hospitalRoutes'));
app.use('/api/medico', require('./routes/medicosRoutes'));
app.use('/api/todo', require('./routes/searchRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes'));

app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});