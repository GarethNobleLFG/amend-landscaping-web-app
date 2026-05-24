const Appointment = require('../models/appointments'); 

const create = async (appointmentData) => {
  try {
    return await Appointment.create(appointmentData);
  } 
  catch (error) {
    throw error;
  }
};

const findAll = async () => {
  try {
    return await Appointment.findAll({
      order: [['createdAt', 'DESC']] 
    });
  } 
  catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  try {
    return await Appointment.findByPk(id);
  } 
  catch (error) {
    throw error;
  }
};

const update = async (id, updateData) => {
  try {
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return null; 
    }

    return await appointment.update(updateData);
  } 
  catch (error) {
    throw error;
  }
};

const deleteAppointment = async (id) => {
  try {
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return false;
    }

    await appointment.destroy();
    return true; 
  } 
  catch (error) {
    throw error;
  }
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  deleteAppointment 
};