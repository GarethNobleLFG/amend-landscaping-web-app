const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Create a new appointment (Public - no auth required)
router.post('/', appointmentController.create);

// Get all appointments
router.get('/', authenticateToken, requireAdmin, appointmentController.getAll);

// Get a single appointment by ID
router.get('/:id', authenticateToken, requireAdmin, appointmentController.getById);

// Update an appointment by ID
router.put('/:id', authenticateToken, requireAdmin, appointmentController.update);

// Approve an appointment by ID
router.patch('/:id/approve', authenticateToken, requireAdmin, appointmentController.approve);

// Mark an appointment as seen
router.patch('/:id/seen', authenticateToken, requireAdmin, appointmentController.markAsSeen);

// Deny an appointment by ID
router.patch('/:id/deny', authenticateToken, requireAdmin, appointmentController.deny);

// Cancel an appointment by ID
router.patch('/:id/cancel', authenticateToken, requireAdmin, appointmentController.cancel);

module.exports = router;
