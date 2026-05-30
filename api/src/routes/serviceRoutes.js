const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/serviceController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Create a new service (admin only)
router.post('/', authenticateToken, requireAdmin, serviceController.createService);

// Get all services including unavailable ones (admin only)
router.get('/all', authenticateToken, requireAdmin, serviceController.getAllServices);

// Get only available services (public)
router.get('/', serviceController.getAvailableServices);

// Get a service by ID (public)
router.get('/:id', serviceController.getServiceById);

// Update a service (admin only)
router.put('/:id', authenticateToken, requireAdmin, serviceController.updateService);

// Delete a service (admin only)
router.delete('/:id', authenticateToken, requireAdmin, serviceController.deleteService);

module.exports = router;
