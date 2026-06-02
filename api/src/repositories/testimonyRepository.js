const Testimony = require('../models/testimonies');

const create = async (testimonyData) => {
  return await Testimony.create(testimonyData);
};

const findAll = async () => {
  return await Testimony.findAll({
    order: [['createdAt', 'DESC']]
  });
};

const deleteById = async (id) => {
  const result = await Testimony.destroy({
    where: { id }
  });
  return result > 0;
};

module.exports = {
  create,
  findAll,
  deleteById
};