const express = require('express');
const mongoose = require('mongoose');
const originalRoutes = require('./routes/routes'); 
const animalRoutes = require('./routes/animalPerdidoEncontrado');
const animalAdocao = require('./routes/animalAdocao');
const authRoutes = require('./routes/auth');
const app = express();

app.use(express.json());
app.use('/perdidos/animais-perdidos', animalRoutes);
app.use('/auth', authRoutes);
app.use(originalRoutes); 
app.use(animalAdocao); 

module.exports = app;