const serviceRepo = require('../repositories/serviceRepository');

const createService = async (name, description, is_available = true, image_id = null) => {
  const sanitizedImageId = image_id === '' ? null : image_id;
  return await serviceRepo.create({ name, description, is_available, image_id: sanitizedImageId });
};

const getAllServices = async () => {
  return await serviceRepo.findAll();
};

const getAvailableServices = async () => {
  return await serviceRepo.findAvailable();
};

const getServiceById = async (id) => {
  return await serviceRepo.findById(id);
};

const updateService = async (id, name, description, is_available, image_id) => {
  const sanitizedImageId = image_id === '' ? null : image_id;
  return await serviceRepo.update(id, { name, description, is_available, image_id: sanitizedImageId });
};

const deleteService = async (id) => {
  return await serviceRepo.deleteService(id);
};

module.exports = {
  createService,
  getAllServices,
  getAvailableServices,
  getServiceById,
  updateService,
  deleteService
};