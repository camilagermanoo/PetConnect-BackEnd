const express = require('express');
const router = express.Router();

const animalController = require('../controllers/animalController.js');

router.get('/', (req, res) => {
  res.send('API de Animais funcionando');
});

// --- ROTAS PARA O CRUD DE ANIMAIS ---

// 2. Rota para CADASTRAR (POST)
router.post('/animais', animalController.criarAnimal);

// 3. Rota para LISTAR TODOS (GET)
router.get('/animais', animalController.listarTodosAnimais);

// 4. Rota para BUSCAR POR ID (GET /:id)
router.get('/animais/:id', animalController.buscarAnimalPorId);

// 5. Rota para SUBSTITUIR (PUT /:id)
router.put('/animais/:id', animalController.substituirAnimal);

// 6. Rota para ATUALIZAR PARCIAL (PATCH /:id)
router.patch('/animais/:id', animalController.atualizarAnimal);

// 7. Rota para DELETAR (DELETE /:id)
router.delete('/animais/:id', animalController.deletarAnimal);

module.exports = router;