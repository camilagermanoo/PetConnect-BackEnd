const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "testAuthDB" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  delete mongoose.connection.models['User'];
});

describe('Testes de Autenticação', () => {

  describe('1 - Registro de Usuário', () => {

    test('POST /auth/register deve retornar 201 e registrar usuário', async () => {
      const novoUsuario = {
        email: 'teste@example.com',
        password: '123456',
        nome: 'João Silva'
      };

      const res = await request(app)
        .post('/auth/register')
        .send(novoUsuario);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Usuário registrado com sucesso!');
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('teste@example.com');
      expect(res.body.user.nome).toBe('João Silva');
      expect(res.body.user).not.toHaveProperty('password'); // Senha não deve ser retornada
    });

    test('POST /auth/register deve gerar um token JWT válido', async () => {
      const novoUsuario = {
        email: 'token@test.com',
        password: 'senha123',
        nome: 'Maria Santos'
      };

      const res = await request(app)
        .post('/auth/register')
        .send(novoUsuario);

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();

      // Verificar se o token é válido
      const decoded = jwt.verify(
        res.body.token, 
        process.env.JWT_SECRET || 'secret_key_test'
      );
      
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('email', 'token@test.com');
      expect(decoded).toHaveProperty('exp'); // Token tem expiração
    });

    test('POST /auth/register deve armazenar senha criptografada', async () => {
      const novoUsuario = {
        email: 'seguro@test.com',
        password: 'minhasenha',
        nome: 'Pedro Costa'
      };

      const res = await request(app)
        .post('/auth/register')
        .send(novoUsuario);

      expect(res.status).toBe(201);

      // Buscar usuário no banco
      const usuarioDB = await User.findOne({ email: 'seguro@test.com' });
      
      expect(usuarioDB.password).not.toBe('minhasenha'); // Senha não está em texto puro
      expect(usuarioDB.password).toMatch(/^\$2[ayb]\$.{56}$/); // Formato bcrypt
    });

    describe('POST /auth/register deve retornar erro quando:', () => {

      test('a) Email não é fornecido', async () => {
        const usuarioSemEmail = {
          password: '123456',
          nome: 'Teste'
        };

        const res = await request(app)
          .post('/auth/register')
          .send(usuarioSemEmail);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Erro ao registrar usuário');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('O email é obrigatório');
      });

      test('b) Senha não é fornecida', async () => {
        const usuarioSemSenha = {
          email: 'teste@test.com',
          nome: 'Teste'
        };

        const res = await request(app)
          .post('/auth/register')
          .send(usuarioSemSenha);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Erro ao registrar usuário');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('A senha é obrigatória');
      });

      test('c) Nome não é fornecido', async () => {
        const usuarioSemNome = {
          email: 'teste@test.com',
          password: '123456'
        };

        const res = await request(app)
          .post('/auth/register')
          .send(usuarioSemNome);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Erro ao registrar usuário');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('O nome é obrigatório');
      });

      test('d) Email é inválido', async () => {
        const emailInvalido = {
          email: 'email-invalido',
          password: '123456',
          nome: 'Teste'
        };

        const res = await request(app)
          .post('/auth/register')
          .send(emailInvalido);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Erro ao registrar usuário');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('Email inválido');
      });

      test('e) Senha tem menos de 6 caracteres', async () => {
        const senhaCurta = {
          email: 'teste@test.com',
          password: '123',
          nome: 'Teste'
        };

        const res = await request(app)
          .post('/auth/register')
          .send(senhaCurta);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Erro ao registrar usuário');
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('A senha deve ter pelo menos 6 caracteres');
      });

      test('f) Email já está cadastrado', async () => {
        const usuario = {
          email: 'duplicado@test.com',
          password: '123456',
          nome: 'Primeiro'
        };

        // Primeiro registro
        await request(app).post('/auth/register').send(usuario);

        // Tentar registrar novamente com mesmo email
        const usuario2 = {
          email: 'duplicado@test.com',
          password: 'outrasenha',
          nome: 'Segundo'
        };

        const res = await request(app)
          .post('/auth/register')
          .send(usuario2);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Usuário já cadastrado com este email');
      });
    });
  });

  describe('2 - Login de Usuário', () => {

    test('POST /auth/login deve retornar 200 e fazer login com sucesso', async () => {
      // Primeiro, criar um usuário
      const usuario = {
        email: 'login@test.com',
        password: 'senha123',
        nome: 'Usuário Teste'
      };
      await request(app).post('/auth/register').send(usuario);

      // Fazer login
      const credenciais = {
        email: 'login@test.com',
        password: 'senha123'
      };

      const res = await request(app)
        .post('/auth/login')
        .send(credenciais);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login realizado com sucesso!');
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('login@test.com');
      expect(res.body.user.nome).toBe('Usuário Teste');
    });

    test('POST /auth/login deve gerar token JWT válido', async () => {
      // Criar usuário
      await request(app).post('/auth/register').send({
        email: 'jwt@test.com',
        password: 'senha456',
        nome: 'JWT Test'
      });

      // Login
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'jwt@test.com',
          password: 'senha456'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();

      // Verificar token
      const decoded = jwt.verify(
        res.body.token,
        process.env.JWT_SECRET || 'secret_key_test'
      );

      expect(decoded).toHaveProperty('email', 'jwt@test.com');
      expect(decoded).toHaveProperty('exp');
    });

    test('POST /auth/login deve aceitar email em maiúsculas/minúsculas', async () => {
      // Registrar com email minúsculo
      await request(app).post('/auth/register').send({
        email: 'case@test.com',
        password: '123456',
        nome: 'Case Test'
      });

      // Login com email em maiúsculas
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'CASE@TEST.COM',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    describe('POST /auth/login deve retornar erro quando:', () => {

      test('a) Email não é fornecido', async () => {
        const res = await request(app)
          .post('/auth/login')
          .send({
            password: '123456'
          });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Email e senha são obrigatórios');
      });

      test('b) Senha não é fornecida', async () => {
        const res = await request(app)
          .post('/auth/login')
          .send({
            email: 'teste@test.com'
          });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Email e senha são obrigatórios');
      });

      test('c) Email não existe no sistema', async () => {
        const res = await request(app)
          .post('/auth/login')
          .send({
            email: 'naoexiste@test.com',
            password: '123456'
          });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Credenciais inválidas');
      });

      test('d) Senha está incorreta', async () => {
        // Criar usuário
        await request(app).post('/auth/register').send({
          email: 'senhaerrada@test.com',
          password: 'senhaCorreta123',
          nome: 'Teste Senha'
        });

        // Tentar login com senha errada
        const res = await request(app)
          .post('/auth/login')
          .send({
            email: 'senhaerrada@test.com',
            password: 'senhaErrada456'
          });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Credenciais inválidas');
      });
    });
  });

  describe('3 - Segurança e Validações', () => {

    test('Senha não deve aparecer na resposta do registro', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'seguro@test.com',
          password: 'senhaSecreta',
          nome: 'Seguro'
        });

      expect(res.body.user).not.toHaveProperty('password');
    });

    test('Senha não deve aparecer na resposta do login', async () => {
      await request(app).post('/auth/register').send({
        email: 'login2@test.com',
        password: 'senha789',
        nome: 'Login2'
      });

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'login2@test.com',
          password: 'senha789'
        });

      expect(res.body.user).not.toHaveProperty('password');
    });

    test('Token deve ter tempo de expiração', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'expira@test.com',
          password: '123456',
          nome: 'Expira'
        });

      const decoded = jwt.decode(res.body.token);
      
      expect(decoded).toHaveProperty('exp');
      expect(decoded).toHaveProperty('iat');
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });
});
