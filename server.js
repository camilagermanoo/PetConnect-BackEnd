require('dotenv').config();
const express = require('express');
const conectarBanco = require('./src/db');

const rotasPrincipais = require('./src/routes/routes');

const app = express();

app.use(express.json());


conectarBanco();

app.use('/api', rotasPrincipais);

app.get('/', (req, res) => {
    res.send('API PetConnect rodando! 🐶🐱');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});