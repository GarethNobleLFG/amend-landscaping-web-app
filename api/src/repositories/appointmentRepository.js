const Appointment = require('../models/appointments'); 

const create = async (appointmentData) => {
  return await Appointment.create(appointmentData);
};

const findAll = async () => {
  return await Appointment.findAll({
    order: [['createdAt', 'DESC']] 
  });
};

const findById = async (id) => {
  return await Appointment.findByPk(id);
};

const update = async (id, updateData) => {
  const appointment = await Appointment.findByPk(id);
  
  if (!appointment) {
    return null; 
  }

  return await appointment.update(updateData);
};

const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);
  
  if (!appointment) {
    return false;
  }

  await appointment.destroy();
  return true; 
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  deleteAppointment 
};