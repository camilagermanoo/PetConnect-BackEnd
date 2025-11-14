const { Router } = require('express');
const router = Router();

const rotasAdocao = require('./animalAdocao.js');
const rotasPerdidos = require('./animalPerdidoEncontrado.js');

router.use('/adocao', rotasAdocao);

router.use('/perdidos', rotasPerdidos);

module.exports = router;