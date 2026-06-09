const express = require('express');
const router = express.Router();
const imageRegistryController = require('../controllers/imageRegistryController');
const imageStreamController = require('../controllers/imageStreamController'); 
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, requireAdmin, imageRegistryController.uploadImage);
router.get('/', authenticateToken, requireAdmin, imageRegistryController.getAllImages);

router.get('/stream/:id', imageStreamController.streamImage);

router.get('/:id', imageRegistryController.getImageById);
router.delete('/:id', authenticateToken, requireAdmin, imageRegistryController.deleteImage);

module.exports = router;