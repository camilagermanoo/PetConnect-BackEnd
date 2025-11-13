const express = require('express');

const originalRoutes = require('./routes/routes'); 
const animalRoutes = require('./routes/animalPerdidoEncontrado');
const animalAdocao = require('./routes/animalAdocao');

const app = express();
app.use(express.json());
app.use(originalRoutes); 
app.use(animalRoutes);
app.use(animalAdocao);

module.exports = app;