const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do animal é obrigatório.'],
        trim: true,
    },
    especie: {
        type: String,
        required: [true, 'A espécie do animal é obrigatória.'],
        trim: true,
    },
    idade: {
        type: Number,
        required: [true, 'A idade do animal é obrigatória.'],
    },
    porte: {
        type: String,
        enum: ["Pequeno", "Médio", "Grande"],
        required: [true, 'O porte do animal é obrigatório.'],
    },
    descricao: {
        type: String,
        required: [true, 'A descrição é obrigatória.'],
        trim: true,
    },
    contato: {
        type: String,
        required: [true, 'A informação de contato é obrigatória.'],
        trim: true
    },
    status_adocao: {                          // ⭐ ADICIONE ESTE CAMPO
        type: String,
        enum: ["Disponível", "Adotado", "Em processo"],
        default: "Disponível",
        trim: true
      }
}, { timestamps: true });

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;