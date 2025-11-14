// tests/animalPerdido.test.js
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const AnimalPerdidoEncontrado = require('../src/models/AnimalPerdidoEncontrado');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "testPerdidosDB" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await AnimalPerdidoEncontrado.deleteMany({});
  delete mongoose.connection.models['AnimalPerdidoEncontrado'];
});

describe('Testes de CRUD - Animais Perdidos/Encontrados', () => {
  describe('1 - Cadastrar animal perdido', () => {

    test('POST /perdidos/animais-perdidos deve retornar 201 e cadastrar', async () => {
      const novoAnimal = {
        nome: 'Rex',
        especie: 'Cachorro',
        idade: 5,
        porte: 'Grande',
        status: 'Perdido',
        descricao: 'Cachorro marrom, coleira azul',
        contato: '(11) 98765-4321',
        local: 'Parque Ibirapuera'
      };

      const res = await request(app)
        .post('/perdidos/animais-perdidos')
        .send(novoAnimal);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('msg', 'Animal perdido/encontrado cadastrado com sucesso!');
      expect(res.body.animal).toHaveProperty('_id');
      expect(res.body.animal.nome).toBe('Rex');
      expect(res.body.animal.status).toBe('Perdido');
      expect(res.body.animal).toHaveProperty('createdAt');
    });

    describe('POST /perdidos/animais-perdidos incorreto deve retornar 400 quando:', () => {

      test('a) Não tem nome', async () => {
        const animalSemNome = {
          especie: 'Gato',
          idade: 3,
          porte: 'Pequeno',
          status: 'Encontrado',
          descricao: 'Gato preto',
          contato: '(11) 99999-8888',
          local: 'Rua das Flores'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(animalSemNome);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('O nome do animal é obrigatório');
      });

      test('b) Não tem especie', async () => {
        const animalSemEspecie = {
          nome: 'Miau',
          idade: 2,
          porte: 'Pequeno',
          status: 'Encontrado',
          descricao: 'Gato siamês',
          contato: '(11) 91234-5678',
          local: 'Praça da Sé'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(animalSemEspecie);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('A espécie do animal é obrigatória');
      });

      test('c) Não tem idade', async () => {
        const animalSemIdade = {
          nome: 'Thor',
          especie: 'Cachorro',
          porte: 'Grande',
          status: 'Perdido',
          descricao: 'Pastor alemão',
          contato: '(11) 98888-7777',
          local: 'Av. Paulista'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(animalSemIdade);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('A idade do animal é obrigatória');
      });

      test('d) Não tem porte', async () => {
        const animalSemPorte = {
          nome: 'Luna',
          especie: 'Gato',
          idade: 1,
          status: 'Encontrado',
          descricao: 'Gata persa branca',
          contato: '(11) 97777-6666',
          local: 'Vila Mariana'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(animalSemPorte);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('O porte do animal é obrigatório');
      });

      test('e) Não tem status', async () => {
        const animalSemStatus = {
          nome: 'Bob',
          especie: 'Cachorro',
          idade: 4,
          porte: 'Médio',
          descricao: 'Vira-lata caramelo',
          contato: '(11) 96666-5555',
          local: 'Centro'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(animalSemStatus);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('O status (Perdido/Encontrado) é obrigatório');
      });

      test('f) Não tem descricao', async () => {
        const animalSemDescricao = {
          nome: 'Nina',
          especie: 'Gato',
          idade: 2,
          porte: 'Pequeno',
          status: 'Perdido',
          contato: '(11) 95555-4444',
          local: 'Morumbi'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(animalSemDescricao);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('A descrição é obrigatória');
      });

      test('g) Não tem contato', async () => {
        const animalSemContato = {
          nome: 'Max',
          especie: 'Cachorro',
          idade: 6,
          porte: 'Grande',
          status: 'Encontrado',
          descricao: 'Labrador amarelo',
          local: 'Pinheiros'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(animalSemContato);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('A informação de contato é obrigatória');
      });

      test('h) Não tem local', async () => {
        const animalSemLocal = {
          nome: 'Mel',
          especie: 'Gato',
          idade: 3,
          porte: 'Pequeno',
          status: 'Perdido',
          descricao: 'Gato tigrado',
          contato: '(11) 94444-3333'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(animalSemLocal);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('O local (onde foi perdido/encontrado) é obrigatório');
      });

      test('i) Porte é inválido', async () => {
        const porteInvalido = {
          nome: 'Spike',
          especie: 'Cachorro',
          idade: 7,
          porte: 'Gigante', // Não está no enum
          status: 'Perdido',
          descricao: 'Dogue alemão',
          contato: '(11) 93333-2222',
          local: 'Butantã'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(porteInvalido);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
      });

      test('j) Status é inválido', async () => {
        const statusInvalido = {
          nome: 'Freddy',
          especie: 'Gato',
          idade: 4,
          porte: 'Médio',
          status: 'Resgatado', // Não está no enum ["Perdido", "Encontrado"]
          descricao: 'Gato laranja',
          contato: '(11) 92222-1111',
          local: 'Jardins'
        };

        const res = await request(app)
          .post('/perdidos/animais-perdidos')
          .send(statusInvalido);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
        expect(res.body).toHaveProperty('error');
      });
    });
  });

  describe('2 - Buscar animal por ID', () => {

    test('GET /perdidos/animais-perdidos/:id deve retornar 200 e animal', async () => {
      const animal = new AnimalPerdidoEncontrado({
        nome: 'Toby',
        especie: 'Cachorro',
        idade: 5,
        porte: 'Grande',
        status: 'Perdido',
        descricao: 'Golden retriever',
        contato: '(11) 91111-0000',
        local: 'Santana'
      });
      await animal.save();

      const res = await request(app).get(`/perdidos/animais-perdidos/${animal._id}`);

      expect(res.status).toBe(200);
      expect(res.body.nome).toBe('Toby');
      expect(res.body._id).toBe(animal._id.toString());
      expect(res.body.status).toBe('Perdido');
      expect(res.body.local).toBe('Santana');
    });

    describe('GET /perdidos/animais-perdidos/:id deve retornar erro quando:', () => {

      test('a) O animal buscado não existe', async () => {
        const idVazio = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/perdidos/animais-perdidos/${idVazio}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('msg', 'Animal não encontrado');
      });

      test('b) O ID buscado é inválido', async () => {
        const idInvalido = '123456';
        const res = await request(app).get(`/perdidos/animais-perdidos/${idInvalido}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('msg', 'Erro ao buscar animal');
      });
    });
  });

  describe('3 - Listar animais', () => {

    test('GET /perdidos/animais-perdidos deve retornar 200 e lista', async () => {
      await AnimalPerdidoEncontrado.create({
        nome: 'Luna',
        especie: 'Gato',
        idade: 3,
        porte: 'Pequeno',
        status: 'Perdido',
        descricao: 'Siamês',
        contato: '111',
        local: 'Centro'
      });

      await AnimalPerdidoEncontrado.create({
        nome: 'Max',
        especie: 'Cachorro',
        idade: 4,
        porte: 'Grande',
        status: 'Encontrado',
        descricao: 'Labrador',
        contato: '222',
        local: 'Zona Sul'
      });

      await AnimalPerdidoEncontrado.create({
        nome: 'Bella',
        especie: 'Gato',
        idade: 1,
        porte: 'Pequeno',
        status: 'Perdido',
        descricao: 'Persa',
        contato: '333',
        local: 'Zona Leste'
      });

      const res = await request(app).get('/perdidos/animais-perdidos');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].nome).toBe('Luna');
      expect(res.body[1].nome).toBe('Max');
      expect(res.body[2].nome).toBe('Bella');
    });

    test('GET /perdidos/animais-perdidos, ao mostrar lista, pode mostrar status diferentes', async () => {
      await AnimalPerdidoEncontrado.create({
        nome: 'Rex',
        especie: 'Cachorro',
        idade: 5,
        porte: 'Grande',
        status: 'Perdido',
        descricao: 'Pastor alemão',
        contato: '444',
        local: 'Norte'
      });

      await AnimalPerdidoEncontrado.create({
        nome: 'Mia',
        especie: 'Gato',
        idade: 2,
        porte: 'Pequeno',
        status: 'Encontrado',
        descricao: 'Vira-lata',
        contato: '555',
        local: 'Oeste'
      });

      const res = await request(app).get('/perdidos/animais-perdidos');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].status).toBe('Perdido');
      expect(res.body[1].status).toBe('Encontrado');
    });

    test('GET /perdidos/animais-perdidos, ao mostrar lista vazia, retorna array vazio', async () => {
      const res = await request(app).get('/perdidos/animais-perdidos');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
      expect(res.body).toEqual([]);
    });
  });

  describe('4 - Atualizar animal', () => {

    test('PATCH /perdidos/animais-perdidos/:id deve retornar 200 e atualizar dados parcialmente', async () => {
      const animal = await AnimalPerdidoEncontrado.create({
        nome: 'Thor',
        especie: 'Cachorro',
        idade: 6,
        porte: 'Grande',
        status: 'Perdido',
        descricao: 'Rottweiler',
        contato: '666',
        local: 'Ipiranga'
      });

      const atualizacao = {
        status: 'Encontrado',
        local: 'Mooca'
      };

      const res = await request(app)
        .patch(`/perdidos/animais-perdidos/${animal._id}`)
        .send(atualizacao);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Animal atualizado com sucesso!');
      expect(res.body.animal.status).toBe('Encontrado');
      expect(res.body.animal.local).toBe('Mooca');
      expect(res.body.animal.nome).toBe('Thor'); // Não alterado
    });

    test('PUT /perdidos/animais-perdidos/:id deve retornar 200 e substituir todos os dados', async () => {
      const animal = await AnimalPerdidoEncontrado.create({
        nome: 'Spike',
        especie: 'Cachorro',
        idade: 8,
        porte: 'Médio',
        status: 'Perdido',
        descricao: 'Beagle',
        contato: '777',
        local: 'Tatuapé'
      });

      const dadosNovos = {
        nome: 'Spike Jr.',
        especie: 'Cachorro',
        idade: 9,
        porte: 'Grande',
        status: 'Encontrado',
        descricao: 'Beagle com coleira vermelha',
        contato: '888',
        local: 'Penha'
      };

      const res = await request(app)
        .put(`/perdidos/animais-perdidos/${animal._id}`)
        .send(dadosNovos);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Animal substituído com sucesso!');
      expect(res.body.animal.nome).toBe('Spike Jr.');
      expect(res.body.animal.idade).toBe(9);
      expect(res.body.animal.porte).toBe('Grande');
      expect(res.body.animal.status).toBe('Encontrado');
    });

    describe('Atualização deve retornar erro quando:', () => {

      test('a) O animal não existe (PATCH)', async () => {
        const idInexistente = new mongoose.Types.ObjectId();
        const atualizacao = { status: 'Encontrado' };

        const res = await request(app)
          .patch(`/perdidos/animais-perdidos/${idInexistente}`)
          .send(atualizacao);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('msg', 'Animal não encontrado para atualização');
      });

      test('b) O animal não existe (PUT)', async () => {
        const idInexistente = new mongoose.Types.ObjectId();
        const dadosNovos = {
          nome: 'Test',
          especie: 'Gato',
          idade: 2,
          porte: 'Pequeno',
          status: 'Perdido',
          descricao: 'Teste',
          contato: '999',
          local: 'Teste'
        };

        const res = await request(app)
          .put(`/perdidos/animais-perdidos/${idInexistente}`)
          .send(dadosNovos);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('msg', 'Animal não encontrado para substituição');
      });

      test('c) Dados inválidos (status inválido)', async () => {
        const animal = await AnimalPerdidoEncontrado.create({
          nome: 'Lola',
          especie: 'Gato',
          idade: 3,
          porte: 'Pequeno',
          status: 'Perdido',
          descricao: 'Gato malhado',
          contato: '000',
          local: 'Consolação'
        });

        const atualizacaoInvalida = {
          status: 'Resgatado' // Status inválido
        };

        const res = await request(app)
          .patch(`/perdidos/animais-perdidos/${animal._id}`)
          .send(atualizacaoInvalida);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao atualizar animal');
      });
    });
  });

  describe('5 - Remover animal', () => {

    test('DELETE /perdidos/animais-perdidos/:id deve retornar 200 e remover animal', async () => {
      const animal = await AnimalPerdidoEncontrado.create({
        nome: 'Buddy',
        especie: 'Cachorro',
        idade: 4,
        porte: 'Médio',
        status: 'Encontrado',
        descricao: 'Cocker spaniel',
        contato: '1010',
        local: 'Lapa'
      });

      const res = await request(app).delete(`/perdidos/animais-perdidos/${animal._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Animal removido com sucesso!');

      // Verificar que foi removido do banco
      const animalRemovido = await AnimalPerdidoEncontrado.findById(animal._id);
      expect(animalRemovido).toBeNull();
    });

    describe('DELETE /perdidos/animais-perdidos/:id deve retornar erro quando:', () => {

      test('a) Animal não existe', async () => {
        const idInexistente = new mongoose.Types.ObjectId();

        const res = await request(app).delete(`/perdidos/animais-perdidos/${idInexistente}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('msg', 'Animal não encontrado para exclusão');
      });

      test('b) ID inválido', async () => {
        const idInvalido = 'abc123';

        const res = await request(app).delete(`/perdidos/animais-perdidos/${idInvalido}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('msg', 'Erro ao deletar animal');
      });
    });
  });
});
