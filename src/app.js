const express = require('express');

const originalRoutes = require('./routes/routes.js');
const animalRoutes = require('./routes/animal.js');
const animalPerdidoEncontradoRoutes = require('./routes/animalPerdidoEncontrado.js'); 

const app = express();
app.use(express.json());
app.use('/api', originalRoutes); 
app.use('/api', animalRoutes); 
app.use('/api', animalPerdidoEncontradoRoutes);

module.exports = app;