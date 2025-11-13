const express = require('express');

const originalRoutes = require('./routes/routes'); 
const animalRoutes = require('./routes/animalPerdidoEncontrado'); 

const app = express();
app.use(express.json());
app.use(originalRoutes); 
app.use(animalRoutes);

module.exports = app;