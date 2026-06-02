const testimonyService = require('../services/testimonyService');

const getTestimonies = async (req, res) => {
  try {
    const testimonies = await testimonyService.getAllTestimonies();
    res.json(testimonies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTestimony = async (req, res) => {
  try {
    const { name, quote } = req.body;
    const newTestimony = await testimonyService.addTestimony(name, quote);
    res.status(201).json(newTestimony);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTestimony = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await testimonyService.removeTestimony(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Testimony not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTestimonies,
  createTestimony,
  deleteTestimony
};