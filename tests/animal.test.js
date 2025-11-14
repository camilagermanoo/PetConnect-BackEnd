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
});