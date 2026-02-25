const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

router.get('/users', authenticateJWT, requireAdmin, exportController.getExportUsers);
router.get('/classes', authenticateJWT, requireAdmin, exportController.getExportClasses);
router.get('/stats', authenticateJWT, requireAdmin, exportController.getExportStats);

module.exports = router;
