const Service = require('../models/services');

const createService = async (name, description, is_available = true) => {
  const service = await Service.create({ name, description, is_available });
  return { success: true, data: service };
};

const getAllServices = async () => {
  const services = await Service.findAll();
  return services;
};

const getAvailableServices = async () => {
  const services = await Service.findAll({ where: { is_available: true } });
  return services;
};

const getServiceById = async (id) => {
  const service = await Service.findByPk(id);
  return service;
};

const updateService = async (id, name, description, is_available) => {
  const service = await Service.findByPk(id);
  if (!service) {
    return null;
  }
  await service.update({ name, description, is_available });
  return service;
};

const deleteService = async (id) => {
  const service = await Service.findByPk(id);
  if (!service) {
    return null;
  }
  await service.destroy();
  return true;
};

module.exports = {
  createService,
  getAllServices,
  getAvailableServices,
  getServiceById,
  updateService,
  deleteService
};
