require('dotenv').config();
const express = require('express');
const conectarBanco = require('./src/db');
const rotasPrincipais = require('./src/routes/routes');

const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const app = express();

app.use(express.json());

conectarBanco();

app.use('/api', rotasPrincipais);

const yamlFilePath = path.join(__dirname, 'swagger.yaml');

let swaggerDocument;
try {
  const file = fs.readFileSync(yamlFilePath, 'utf8');
  
  swaggerDocument = YAML.parse(file);

} catch (error) {
  console.error('❌ Erro ao ler ou parsear o arquivo swagger.yaml:', error);
  
  swaggerDocument = {
    openapi: '3.0.0',
    info: { title: 'Erro de Documentação', description: 'Não foi possível carregar o arquivo swagger.yaml.' }
  };
}

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get('/', (req, res) => {
    res.send('API PetConnect rodando! 🐶🐱');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);

    console.log(`📚 Documentação disponível em http://localhost:${PORT}/api-docs`);
});