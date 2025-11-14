const AnimalPerdidoEncontrado = require("../models/AnimalPerdidoEncontrado");

// POST (Criar)
const criarAnimal = async (req, res) => {
    try {
        const novoAnimal = new AnimalPerdidoEncontrado(req.body);
        const animalSalvo = await novoAnimal.save();
        res.status(201).json({ msg: "Animal perdido/encontrado cadastrado com sucesso!", animal: animalSalvo });
    } catch (error) {
        res.status(400).json({ msg: "Erro ao cadastrar animal", error: error.message });
    }
};

// GET (Listar Todos)
const listarTodosAnimais = async (req, res) => {
    try {
        const animais = await AnimalPerdidoEncontrado.find();
        res.status(200).json(animais);
    } catch (error) {
        res.status(500).json({ msg: "Erro ao buscar animais", error: error.message });
    }
};

// GET (Buscar por ID)
const buscarAnimalPorId = async (req, res) => {
    try {
        const animal = await AnimalPerdidoEncontrado.findById(req.params.id);
        if (!animal) {
            return res.status(404).json({ msg: "Animal não encontrado" });
        }
        res.status(200).json(animal);
    } catch (error) {
        res.status(500).json({ msg: "Erro ao buscar animal", error: error.message });
    }
};


const substituirAnimal = async (req, res) => {
    try {
        const animal = await AnimalPerdidoEncontrado.findOneAndReplace(
            { _id: req.params.id }, 
            req.body,              
            { new: true, runValidators: true }
        );
        if (!animal) {
            return res.status(404).json({ msg: "Animal não encontrado para substituição" });
        }
        res.status(200).json({ msg: "Animal substituído com sucesso!", animal });
    } catch (error) {
        res.status(400).json({ msg: "Erro ao substituir animal", error: error.message });
    }
};

// PATCH (Atualização Parcial)
const atualizarAnimal = async (req, res) => {
    try {
        const animal = await AnimalPerdidoEncontrado.findByIdAndUpdate(
            req.params.id,
            req.body, 
            { new: true, runValidators: true }
        );
        if (!animal) {
            return res.status(404).json({ msg: "Animal não encontrado para atualização" });
        }
        res.status(200).json({ msg: "Animal atualizado com sucesso!", animal });
    } catch (error) {
        res.status(400).json({ msg: "Erro ao atualizar animal", error: error.message });
    }
};

// DELETE (Excluir)
const deletarAnimal = async (req, res) => {
    try {
        const animal = await AnimalPerdidoEncontrado.findByIdAndDelete(req.params.id);
        if (!animal) {
            return res.status(404).json({ msg: "Animal não encontrado para exclusão" });
        }
        res.status(200).json({ msg: "Animal removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao deletar animal", error: error.message });
    }
};

module.exports = {
    criarAnimal,
    listarTodosAnimais,
    buscarAnimalPorId,
    substituirAnimal,
    atualizarAnimal,
    deletarAnimal
};