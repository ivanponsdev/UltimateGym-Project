const express = require('express');
const router = express.Router();

// Importar funciones del controlador de usuarios
const { loginUser, loginDemoUser, createUser } = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/demo-login', loginDemoUser);

// POST /api/auth/register  
router.post('/register', createUser);

module.exports = router;