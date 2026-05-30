const Service = require('../models/services');

const createService = async (description, is_available = true) => {
  try {
    const service = await Service.create({ description, is_available });
    return { success: true, data: service };
  } catch (error) {
    throw error;
  }
};

const getAllServices = async () => {
  try {
    const services = await Service.findAll();
    return services;
  } catch (error) {
    throw error;
  }
};

const getAvailableServices = async () => {
  try {
    const services = await Service.findAll({ where: { is_available: true } });
    return services;
  } catch (error) {
    throw error;
  }
};

const getServiceById = async (id) => {
  try {
    const service = await Service.findByPk(id);
    return service;
  } catch (error) {
    throw error;
  }
};

const updateService = async (id, description, is_available) => {
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return null;
    }
    await service.update({ description, is_available });
    return service;
  } catch (error) {
    throw error;
  }
};

const deleteService = async (id) => {
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return null;
    }
    await service.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createService,
  getAllServices,
  getAvailableServices,
  getServiceById,
  updateService,
  deleteService
};
