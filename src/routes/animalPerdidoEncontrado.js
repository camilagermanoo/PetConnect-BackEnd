const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const animalPerdidoController = require('../controllers/animalPerdidoEncontradoController');

router.get('/', animalPerdidoController.listarTodosAnimais);
router.get('/:id', animalPerdidoController.buscarAnimalPorId);

router.post('/', authMiddleware, animalPerdidoController.criarAnimal);
router.put('/:id', authMiddleware, animalPerdidoController.substituirAnimal);
router.patch('/:id', authMiddleware, animalPerdidoController.atualizarAnimal);
router.delete('/:id', authMiddleware, animalPerdidoController.deletarAnimal);

module.exports = router;
