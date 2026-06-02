const imageRegistryService = require('../services/imageRegistryService');

const uploadImage = async (req, res) => {
  try {
    const { image_data } = req.body;
    const result = await imageRegistryService.uploadImage(image_data);
    res.status(201).json(result.data);
  } 
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await imageRegistryService.getAllImages();
    res.status(200).json(images);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImageById = async (req, res) => {
  try {
    const image = await imageRegistryService.getImageById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(200).json(image);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const success = await imageRegistryService.deleteImage(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(204).send();
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  getImageById,
  deleteImage,
};