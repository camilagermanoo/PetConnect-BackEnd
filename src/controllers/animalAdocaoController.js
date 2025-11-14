const animalAdocao = require("../models/animalAdocao");

const cadastrarAnimal = async (req, res) => {
    try {
        const novoAnimal = new animalAdocao(req.body);
        const animalSalvo = await novoAnimal.save();
        res.status(201).json({ msg: "Animal para adoção cadastrado com sucesso!", animal: animalSalvo });
    } catch (error) {
        res.status(400).json({ msg: "Erro ao cadastrar animal", error: error.message });
    }
};

const listarAnimal = async (req, res) => {
    try {
        const animais = await animalAdocao.find();
        res.status(200).json(animais);
    } catch (error) {
        res.status(500).json({ msg: "Erro ao listar animais", error: error.message });
    }
};

const buscarAnimal = async (req, res) => {
    try {
        const animal = await animalAdocao.findById(req.params.id);
        if (!animal) {
            return res.status(404).json({ msg: "Animal não encontrado" });
        }
        res.status(200).json(animal);
    } catch (error) {
        res.status(500).json({ msg: "Erro ao buscar animal", error: error.message });
    }
};

const atualizarDadosAnimal = async (req, res) => {
    try {
        const animal = await animalAdocao.findOneAndReplace(
            { _id: req.params.id }, 
            req.body,              
            { new: true, runValidators: true }
        );
        if (!animal) {
            return res.status(404).json({ msg: "Animal não encontrado para atualizar seus dados" });
        }
        res.status(200).json({ msg: "Dados do animal atualizados!", animal });
    } catch (error) {
        res.status(400).json({ msg: "Erro ao atualizar dados", error: error.message });
    }
};

const removerAnimal = async (req, res) => {
    try {
        const animal = await animalAdocao.findByIdAndDelete(req.params.id);
        if (!animal) {
            return res.status(404).json({ msg: "Animal não encontrado para remoção" });
        }
        res.status(200).json({ msg: "Animal removido!" });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao deletar animal", error: error.message });
    }
};

module.exports = { cadastrarAnimal, listarAnimal, buscarAnimal, atualizarDadosAnimal, removerAnimal };