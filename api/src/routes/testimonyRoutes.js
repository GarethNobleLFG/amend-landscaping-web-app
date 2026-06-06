const express = require('express');
const router = express.Router();
const testimonyController = require('../controllers/testimonyController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public - view reviews
router.get('/', testimonyController.getTestimonies);

// Admin only - manage content
router.post('/', authenticateToken, requireAdmin, testimonyController.createTestimony);
router.delete('/:id', authenticateToken, requireAdmin, testimonyController.deleteTestimony);

module.exports = router;