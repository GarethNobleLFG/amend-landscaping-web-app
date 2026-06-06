const serviceService = require('../services/serviceService');

const createService = async (req, res) => {
  try {
    const { name, description, is_available = true, image_id } = req.body;
    const service = await serviceService.createService(name, description, is_available, image_id);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAvailableServices = async (req, res) => {
  try {
    const services = await serviceService.getAvailableServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { name, description, is_available, image_id } = req.body;
    const service = await serviceService.updateService(req.params.id, name, description, is_available, image_id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const success = await serviceService.deleteService(req.params.id);
    if (!success) return res.status(404).json({ error: 'Service not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createService,
  getAllServices,
  getAvailableServices,
  getServiceById,
  updateService,
  deleteService,
};