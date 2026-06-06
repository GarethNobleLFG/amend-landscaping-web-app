const imageRegistryRepo = require('../repositories/imageRegistryRepository');

const uploadImage = async (imageData) => {
  if (!imageData) {
    throw new Error('Image data is required');
  }
  const image = await imageRegistryRepo.create(imageData);
  return { success: true, data: image };
};

const getAllImages = async () => {
  return await imageRegistryRepo.findAll();
};

const getImageById = async (id) => {
  return await imageRegistryRepo.findById(id);
};

const deleteImage = async (id) => {
  return await imageRegistryRepo.deleteImage(id);
};

module.exports = {
  uploadImage,
  getAllImages,
  getImageById,
  deleteImage,
};