const express = require('express');
const router = express.Router();

// Importar funciones del controlador de usuarios
const { loginUser, loginDemoUser, loginDemoAdminUser, createUser } = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/demo-login', loginDemoUser);
router.post('/demo-admin-login', loginDemoAdminUser);

// POST /api/auth/register  
router.post('/register', createUser);

module.exports = router;