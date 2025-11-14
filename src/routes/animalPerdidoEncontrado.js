const express = require('express');
const router = express.Router();

const animalPerdidoController = require('../controllers/animalPerdidoEncontradoController');

// --- ROTAS PARA O CRUD DE ANIMAIS PERDIDOS/ENCONTRADOS ---

// 2. Rota para CADASTRAR (POST)
router.post('/animais-perdidos', animalPerdidoController.criarAnimal);

// 3. Rota para LISTAR TODOS (GET)
router.get('/animais-perdidos', animalPerdidoController.listarTodosAnimais);

// 4. Rota para BUSCAR POR ID (GET /:id)
router.get('/animais-perdidos/:id', animalPerdidoController.buscarAnimalPorId);

// 5. Rota para SUBSTITUIR (PUT /:id)
router.put('/animais-perdidos/:id', animalPerdidoController.substituirAnimal);

// 6. Rota para ATUALIZAR PARCIAL (PATCH /:id)
router.patch('/animais-perdidos/:id', animalPerdidoController.atualizarAnimal);

// 7. Rota para DELETAR (DELETE /:id)
router.delete('/animais-perdidos/:id', animalPerdidoController.deletarAnimal);

module.exports = router;