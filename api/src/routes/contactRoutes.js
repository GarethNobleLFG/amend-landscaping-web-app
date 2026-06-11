const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, contactController.getAll);
router.post('/', authenticateToken, requireAdmin, contactController.create);
router.put('/:id', authenticateToken, requireAdmin, contactController.update);
router.delete('/:id', authenticateToken, requireAdmin, contactController.deleteContact);

module.exports = router;