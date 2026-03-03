const express = require('express');
const router = express.Router();
const { 
  getClases,
  getClaseById,
  getMisClases,
  createClase,
  updateClase,
  deleteClase,
  inscribirseEnClase,
  desinscribirseDeClase,
  getAlumnosClase
} = require('../controllers/claseController');
const { authenticateJWT, requireAdmin, requireNotDemoAdmin } = require('../middleware/auth');


router.get('/', authenticateJWT, getClases);
router.get('/mias/listado', authenticateJWT, getMisClases);
router.get('/:id', authenticateJWT, getClaseById);
router.post('/:id/inscribir', authenticateJWT, inscribirseEnClase);
router.delete('/:id/desinscribir', authenticateJWT, desinscribirseDeClase);
router.post('/', authenticateJWT, requireAdmin, requireNotDemoAdmin, createClase);
router.put('/:id', authenticateJWT, requireAdmin, requireNotDemoAdmin, updateClase);
router.delete('/:id', authenticateJWT, requireAdmin, requireNotDemoAdmin, deleteClase);
router.get('/:id/alumnos', authenticateJWT, requireAdmin, getAlumnosClase);

module.exports = router;
