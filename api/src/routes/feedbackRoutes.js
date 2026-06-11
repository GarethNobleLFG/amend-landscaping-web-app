const express = require('express');
const router = express.Router();

const feedbackController = require('../controllers/feedbackController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public endpoint
router.post('/', feedbackController.create);

// Admin endpoints
router.get('/', authenticateToken, requireAdmin, feedbackController.getAll);

router.patch('/:id/read', authenticateToken, requireAdmin, feedbackController.markAsRead);

router.delete('/:id', authenticateToken, requireAdmin, feedbackController.deleteFeedback);

module.exports = router;