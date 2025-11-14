const express = require('express');
const router = express.Router();

const animalAdocaoController = require('../controllers/animalAdocaoController');

// router.get('/', (req, res) => {
//  res.send('Seção de adoção de animais');
// });
// Ignorado, pois causa erro nos testes

router.post('/', animalAdocaoController.cadastrarAnimal);

router.get('/', animalAdocaoController.listarAnimal);

router.get('/:id', animalAdocaoController.buscarAnimal);

router.put('/:id', animalAdocaoController.atualizarDadosAnimal);

router.delete('/:id', animalAdocaoController.removerAnimal);

module.exports = router;