const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const animalAdocaoController = require('../controllers/animalAdocaoController');

router.get('/', animalAdocaoController.listarAnimal);
router.get('/:id', animalAdocaoController.buscarAnimal);

router.post('/', authMiddleware, animalAdocaoController.cadastrarAnimal);
router.put('/:id', authMiddleware, animalAdocaoController.atualizarDadosAnimal);
router.delete('/:id', authMiddleware, animalAdocaoController.removerAnimal);

module.exports = router;