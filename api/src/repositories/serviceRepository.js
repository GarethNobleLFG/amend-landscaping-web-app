const Service = require('../models/services');

const create = async (serviceData) => {
  return await Service.create(serviceData);
};

const findAll = async () => {
  return await Service.findAll();
};

const findAvailable = async () => {
  return await Service.findAll({ where: { is_available: true } });
};

const findById = async (id) => {
  return await Service.findByPk(id);
};

const update = async (id, updateData) => {
  const service = await Service.findByPk(id);
  if (!service) {
    return null;
  }
  return await service.update(updateData);
};

const deleteService = async (id) => {
  const service = await Service.findByPk(id);
  if (!service) {
    return false;
  }
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