const express = require('express')
const router = express.Router()
const { authenticateJWT, requireAdmin } = require('../middleware/auth')
const statsController = require('../controllers/statsController')

// Ruta para obtener estadísticas globales Admin
router.get('/global', authenticateJWT, requireAdmin, statsController.obtenerEstadisticasGlobales)

// Ruta para registrar una interacción con el asistente Paco
router.post('/paco-interaccion', authenticateJWT, statsController.registrarInteraccionPaco)

module.exports = router
