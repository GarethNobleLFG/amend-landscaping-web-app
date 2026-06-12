const Service = require('../models/services');
const ImageRegistry = require('../models/imageRegistry');

const create = async (serviceData) => {
  return await Service.create(serviceData);
};

const findAll = async () => {
  return await Service.findAll({
    include: [{
      model: ImageRegistry,
      as: 'image',
      attributes: ['image_url']
    }],
    order: [['listing_rank', 'ASC'], ['id', 'DESC']]
  });
};

const findAvailable = async () => {
  return await Service.findAll({
    where: { is_available: true },
    include: [{
      model: ImageRegistry,
      as: 'image',
      attributes: ['image_url']
    }],
    order: [['listing_rank', 'ASC'], ['name', 'ASC']]
  });
};

const findById = async (id) => {
  return await Service.findByPk(id, {
    include: [{
      model: ImageRegistry,
      as: 'image',
      attributes: ['image_url']
    }]
  });
};

const update = async (id, updateData) => {
  const service = await Service.findByPk(id);
  if (!service) return null;
  return await service.update(updateData);
};

const deleteService = async (id) => {
  const service = await Service.findByPk(id);
  if (!service) return false;
  await service.destroy();
  return true;
};

module.exports = {
  create,
  findAll,
  findAvailable,
  findById,
  update,
  deleteService,
};