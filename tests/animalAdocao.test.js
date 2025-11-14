const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const AnimalAdocao = require('../src/models/animalAdocao');

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "testAdocaoDB" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await AnimalAdocao.deleteMany({});
  delete mongoose.connection.models['animalAdocao'];
});


describe('Testes de CRUD - Animais para Adoção', () => {
  describe('1 - Cadastrar animal', () => {
    test('POST /adocao deve retornar 201 e Cadastro', async () => {
    const novoAnimal = { 
      nome: 'Belinha', 
      especie: 'Cachorro',
      idade: '2 anos', 
      porte: 'Pequeno', 
      sexo: 'Fêmea'
    };

    const res = await request(app).post('/adocao').send(novoAnimal);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('msg', 'Animal para adoção cadastrado com sucesso!');
    expect(res.body.animal).toHaveProperty('_id');
      expect(res.body.animal.nome).toBe('Belinha');
      expect(res.body.animal.especie).toBe('Cachorro');
      expect(res.body.animal.status).toBe('Disponível');
      expect(res.body.animal).toHaveProperty('createdAt');
    });

    describe('POST /adocao incorreto deve retornar 400 quando:', () => {

      test('a) Não tem nome', async () => {
      const animalSemNome = { especie: 'Cachorro',
        idade: '2 anos', porte: 'Pequeno', sexo: 'Fêmea'};
      const res = await request(app).post('/adocao').send(animalSemNome);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('O nome do animal é obrigatório');
      });

      test('b) Não tem especie', async () => {
      const animalSemEspecie = { nome: 'Belinha', idade: '2 anos',
        porte: 'Pequeno', sexo: 'Fêmea'};
      const res = await request(app).post('/adocao').send(animalSemEspecie);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('A espécie é obrigatória');
      });

      test('c) Não tem idade', async () => {
      const animalSemIdade = { nome: 'Belinha', especie: 'Cachorro',
        porte: 'Pequeno', sexo: 'Fêmea'};
      const res = await request(app).post('/adocao').send(animalSemIdade);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('A idade aproximada é obrigatória');
      });

      test('d) Não tem porte', async () => {
      const animalSemPorte = { nome: 'Belinha', especie: 'Cachorro',
        idade: '2 anos', sexo: 'Fêmea'};
      const res = await request(app).post('/adocao').send(animalSemPorte);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('O porte é obrigatório');
      });

      test('e) Não tem sexo', async () => {
      const animalSemSexo = { nome: 'Belinha', especie: 'Cachorro',
        idade: '2 anos', porte: 'Pequeno'};
      const res = await request(app).post('/adocao').send(animalSemSexo);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Erro ao cadastrar animal');
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('O sexo é obrigatório');
      });

      test('f) Especie é inválida', async () => {
        const novoAnimal = {
          nome: 'Piu',
          especie: 'Passaro',
          idade: '1 ano',
          porte: 'Pequeno',
          sexo: 'Macho'
        };

        const res = await request(app).post('/adocao').send(novoAnimal);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('A espécie deve ser Cachorro, Gato ou Outro');
      });
    });
  });

  describe('2 - Buscar animal por ID', () => {
    test('GET /adocao/:id deve retornar 200 e animal', async () => {
      const animal = new AnimalAdocao({
        nome: 'Toby',
        especie: 'Cachorro',
        idade: '5 anos',
        porte: 'Grande',
        sexo: 'Macho'
      });
      await animal.save();

      const res = await request(app).get(`/adocao/${animal._id}`);

      expect(res.status).toBe(200);
      expect(res.body.nome).toBe('Toby');
      expect(res.body._id).toBe(animal._id.toString());
      expect(res.body.sexo).toBe('Macho');
      expect(res.body.status).toBe('Disponível');
    });

    describe('GET /adocao/:id deve retornar erro quando:', () =>{
      test('a) O animal buscado não existe', async () =>{
        const idVazio = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/adocao/${idVazio}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('msg', 'Animal não encontrado');
      });

      test('b) O ID buscado é inválido', async () => {
        const idInvalido = '123456';
        const res = await request(app).get(`/adocao${idInvalido}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('msg', 'Erro ao buscar animal');
      });
    });
  })

  describe('3 - Listar animais', () => {
    test('GET /adocao deve retornar 200 e lista', async () => {
      await AnimalAdocao.create([
        { nome: 'Luna', especie: 'Gato', idade: '3 anos', porte: 'Médio', sexo: 'Fêmea' }
      ]);

      await AnimalAdocao.create([
        { nome: 'Max', especie: 'Cachorro', idade: '4 anos', porte: 'Grande', sexo: 'Macho' }
      ]);

      await AnimalAdocao.create([
        { nome: 'Bella', especie: 'Outro', idade: '1 ano', porte: 'Pequeno', sexo: 'Fêmea' }
      ]);

      const res = await request(app).get('/adocao');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].nome).toBe('Luna');
      expect(res.body[1].nome).toBe('Max');
      expect(res.body[2].nome).toBe('Bella');
    });

    test('GET /adocao, ao mostrar lista, pode mostrar status diferentes', async () => {
      await AnimalAdocao.create([
        { nome: 'Luna', especie: 'Gato', idade: '3 anos', porte: 'Médio', sexo: 'Fêmea' }
      ]);

      await AnimalAdocao.create([
        { nome: 'Max', especie: 'Cachorro', idade: '4 anos', porte: 'Grande', sexo: 'Macho', status: 'Adotado' }
      ]);

      await AnimalAdocao.create([
        { nome: 'Bella', especie: 'Outro', idade: '1 ano', porte: 'Pequeno', sexo: 'Fêmea', status: 'Em Processo' }
      ]);

      const res = await request(app).get('/adocao');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].status).toBe('Disponível');
      expect(res.body[1].status).toBe('Adotado');
      expect(res.body[2].status).toBe('Em Processo');
    });

    test('GET /adocao, ao mostrar lista vazia, retorna array vazio', async () => {
      const res = await request(app).get('/adocao');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
      expect(res.body).toEqual([]);
    });
  });

  describe('4 - Atualizar animal', () => {
    test('PUT /adocao/:id deve retornar 200 e atualizar todos os dados', async () => {
      const animal = await AnimalAdocao.create({
        nome: 'Freddy',
        especie: 'Cachorro',
        idade: '3 anos',
        porte: 'Médio',
        sexo: 'Macho',
        status: 'Disponível'
      });

      const dadosAtualizados = {
        nome: 'Freddy Jr.',
        especie: 'Cachorro',
        idade: '5 anos',
        porte: 'Grande',
        sexo: 'Macho',
        status: 'Adotado'
      };

      const res = await request(app).put(`/adocao/${animal._id}`).send(dadosAtualizados);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Dados do animal atualizados!');
      expect(res.body.animal.nome).toBe('Freddy Jr.');
      expect(res.body.animal.especie).toBe('Cachorro');
      expect(res.body.animal.porte).toBe('Grande');
      expect(res.body.animal.idade).toBe('5 anos');
      expect(res.body.animal.sexo).toBe('Macho');
      expect(res.body.animal.status).toBe('Adotado');
    });

    describe('PUT /adocao/:id deve retornar erro quando:', () => {
      test('a) O animal não existe', async () => {
        const idInexistente = new mongoose.Types.ObjectId();
        const atualizacao = {
          nome: 'Test',
          especie: 'Gato',
          idade: '2 anos',
          porte: 'Pequeno',
          sexo: 'Fêmea'
        }

        const res = await request(app).put(`/adocao/${idInexistente}`).send(atualizacao);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('msg', 'Animal não encontrado para atualizar seus dados');
      });

      test('b) Os dados forem inválidos', async () => {
        const animal = await AnimalAdocao.create({
          nome: 'Max',
          especie: 'Cachorro',
          idade: '4 anos',
          porte: 'Grande',
          sexo: 'Macho'
        });
        const animalAtualizacao = {
          nome: 'Max',
          especie: 'Peixe',
          idade: '4 anos',
          porte: 'Grande',
          sexo: 'Macho'
        };

        const res = await request(app).put(`/adocao/${animal._id}`).send(animalAtualizacao);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao atualizar dados');
      });

      test('c) Os dados forem incompletos', async () => {
        const animal = await AnimalAdocao.create({
          nome: 'Apolo',
          especie: 'Cachorro',
          idade: '6 anos',
          porte: 'Grande',
          sexo: 'Macho'
        });

        const animalAtualizacao = {
          nome: 'Apolo',
          especie: 'Cachorro'
        };

        const res = await request(app).put(`/adocao/${animal._id}`).send(animalAtualizacao);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Erro ao atualizar dados');
      });
    });
  });

  describe('5 - Remover animal', () => {
    test('DELETE /adocao/:id deve retornar 200 e remover animal', async () => {
      const animal = await AnimalAdocao.create({
        nome: 'Spike',
        especie: 'Gato',
        idade: '2 anos',
        porte: 'Pequeno',
        sexo: 'Macho'
      });
      const res = await request(app).delete(`/adocao/${animal._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Animal removido!');

      const animalRemovido = await AnimalAdocao.findById(animal._id);
      expect(animalRemovido).toBeNull();
    });

    describe('DELETE /adocao/:id deve retornar erro quando:', () => {
      test('a) animal não existe', async () => {
        const idInexistente = new mongoose.Types.ObjectId();

        const res = await request(app).delete(`/adocao/${idInexistente}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('msg', 'Animal não encontrado para remoção');
      });

      test('b) ID inválido', async () => {
        const idInvalido = 'abc123';

        const res = await request(app).delete(`/adocao/${idInvalido}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('msg', 'Erro ao deletar animal');
      });
    });
  
  });
});