const landingImageService = require('../services/landingImageService');

const getLandingImages = async (req, res) => {
  try {
    const images = await landingImageService.getAllLandingImages();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addLandingImage = async (req, res) => {
  try {
    const { image_id } = req.body;
    if (!image_id) {
      return res.status(400).json({ error: 'image_id is required' });
    }
    const newImage = await landingImageService.addLandingImage(image_id);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLandingImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await landingImageService.removeLandingImage(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Landing image not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLandingImages,
  addLandingImage,
  deleteLandingImage
};