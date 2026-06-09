const imageRegistryRepo = require('../repositories/imageRegistryRepository');
const { uploadToStorage } = require('./storageService'); 

const uploadImage = async (base64Data) => {
  const publicUrl = await uploadToStorage(base64Data);

  const image = await imageRegistryRepo.create(publicUrl);
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