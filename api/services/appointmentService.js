const appointmentRepo = require('../repositories/appointmentRepository');

const createAppointment = async (appointmentData) => {
    // (Check if date is available, send confirmation email to be added later)
    return await appointmentRepo.create(appointmentData);
};

const getAllAppointments = async () => {
    return await appointmentRepo.findAll();
};

const getAppointmentById = async (id) => {
    return await appointmentRepo.findById(id);
};

const updateAppointment = async (id, updateData) => {
    // Future business logic goes here (e.g., validating allowed status changes)
    return await appointmentRepo.update(id, updateData);
};

const deleteAppointment = async (id) => {
    return await appointmentRepo.deleteAppointment(id);
};

const approveAppointment = async (id) => {
    // Confirmation email to be added here later.
    return await appointmentRepo.update(id, { approved: true });
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    approveAppointment
};