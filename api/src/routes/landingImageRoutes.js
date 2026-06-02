const express = require('express');
const router = express.Router();
const landingImageController = require('../controllers/landingImageController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public route for the landing page
router.get('/', landingImageController.getLandingImages);

// Admin routes
router.post('/', authenticateToken, landingImageController.addLandingImage);
router.delete('/:id', authenticateToken, landingImageController.deleteLandingImage);

module.exports = router;