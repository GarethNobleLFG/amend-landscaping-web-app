const testimonyRepo = require('../repositories/testimonyRepository');

const addTestimony = async (name, quote) => {
  if (!name || !quote) {
    throw new Error('Name and quote are required');
  }
  return await testimonyRepo.create({ name, quote });
};

const getAllTestimonies = async () => {
  return await testimonyRepo.findAll();
};

const removeTestimony = async (id) => {
  return await testimonyRepo.deleteById(id);
};

module.exports = {
  addTestimony,
  getAllTestimonies,
  removeTestimony
};