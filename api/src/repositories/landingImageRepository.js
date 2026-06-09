const LandingImage = require('../models/landingImages');
const ImageRegistry = require('../models/imageRegistry'); 

const create = async (data) => {
  return await LandingImage.create(data);
};

const findAll = async () => {
  return await LandingImage.findAll({
    include: [{
      model: ImageRegistry,
      as: 'image',
      attributes: ['image_url'] 
    }],
    order: [['createdAt', 'DESC']]
  });
};

const findById = async (id) => {
  return await LandingImage.findByPk(id);
};

const deleteImage = async (id) => {
  const landingImage = await LandingImage.findByPk(id);
  if (!landingImage) return false;
  await landingImage.destroy();
  return true;
};

module.exports = {
  create,
  findAll,
  findById,
  deleteImage
};