const express = require('express');
const router = express.Router();

const animalPerdidoController = require('../controllers/animalPerdidoEncontradoController');

router.post('/', animalPerdidoController.criarAnimal);

router.get('/', animalPerdidoController.listarTodosAnimais);

router.get('/:id', animalPerdidoController.buscarAnimalPorId);

router.put('/:id', animalPerdidoController.substituirAnimal);

router.patch('/:id', animalPerdidoController.atualizarAnimal);

router.delete('/:id', animalPerdidoController.deletarAnimal);

module.exports = router;