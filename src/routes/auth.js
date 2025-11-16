const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/auth/register', authController.registrarUsuario);
router.post('/auth/login', authController.loginUsuario);

module.exports = router;
