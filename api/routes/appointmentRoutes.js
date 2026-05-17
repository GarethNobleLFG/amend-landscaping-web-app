const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Create a new appointment
router.post('/', appointmentController.create);

// Get all appointments
router.get('/', appointmentController.getAll);

// Get a single appointment by ID
router.get('/:id', appointmentController.getById);

// Update an appointment by ID
router.put('/:id', appointmentController.update);

// Delete an appointment by ID
router.delete('/:id', appointmentController.remove);

module.exports = router;