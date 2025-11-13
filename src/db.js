const mongoose = require('mongoose');

const mongoURI = process.env.DB_URI;

async function conectarBanco() {
    try {
        mongoose.set('strictQuery', false);

        await mongoose.connect(mongoURI);
        
        console.log("✅ Conectado ao MongoDB com sucesso!");
    } catch (erro) {
        console.error("❌ Erro ao conectar ao MongoDB:", erro);
        process.exit(1); 
    }
}

module.exports = conectarBanco;