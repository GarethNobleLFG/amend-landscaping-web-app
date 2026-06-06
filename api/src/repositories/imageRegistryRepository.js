const ImageRegistry = require('../models/imageRegistry');

const create = async (imageData) => {
  return await ImageRegistry.create({ image_data: imageData });
};

const findAll = async () => {
  return await ImageRegistry.findAll();
};

const findById = async (id) => {
  return await ImageRegistry.findByPk(id);
};


const deleteImage = async (id) => {
  const image = await ImageRegistry.findByPk(id);
  if (!image) {
    return false;
  }
  await image.destroy();
  return true;
};

module.exports = {
  create,
  findAll,
  findById,
  deleteImage,
};