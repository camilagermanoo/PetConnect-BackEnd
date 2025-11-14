const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registrar usuário
const registrarUsuario = async (req, res) => {
  try {
    const { email, password, nome } = req.body;

    // Verificar se usuário já existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ 
        message: 'Usuário já cadastrado com este email' 
      });
    }

    // Criar novo usuário
    const novoUsuario = new User({ email, password, nome });
    await novoUsuario.save();

    // Gerar token
    const token = jwt.sign(
      { id: novoUsuario._id, email: novoUsuario.email },
      process.env.JWT_SECRET || 'secret_key_test',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: {
        id: novoUsuario._id,
        email: novoUsuario.email,
        nome: novoUsuario.nome
      },
      token
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erro ao registrar usuário', 
      error: error.message 
    });
  }
};

// Login de usuário
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos obrigatórios
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar usuário
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar senha
    const senhaValida = await usuario.comparePassword(password);
    if (!senhaValida) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Gerar token
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'secret_key_test',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: {
        id: usuario._id,
        email: usuario.email,
        nome: usuario.nome
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao fazer login', 
      error: error.message 
    });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario
};
