const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do animal é obrigatório'],
        trim: true
    },
    especie: {
        type: String,
        required: [true, 'A espécie é obrigatória'],
        enum: {
            values: ['Cachorro', 'Gato', 'Outro'],
            message: 'A espécie deve ser Cachorro, Gato ou Outro'
        }
    },
    idade: {
        type: String,
        required: [true, 'A idade aproximada é obrigatória']
    },
    porte: {
        type: String,
        required: [true, 'O porte é obrigatório'],
        enum: ['Pequeno', 'Médio', 'Grande']
    },
    sexo: {
        type: String,
        required: [true, 'O sexo é obrigatório'],
        enum: ['Macho', 'Fêmea']
    },
    status: {
        type: String,
        enum: ['Disponível', 'Adotado', 'Em Processo'],
        default: 'Disponível'
    }
}, {
    timestamps: true
});

const animalAdocao = mongoose.model('animalAdocao', animalSchema);

module.exports = animalAdocao;