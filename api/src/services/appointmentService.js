const appointmentRepo = require('../repositories/appointmentRepository');
const { sendApprovalEmail } = require('./email-services/service-types/approve');
const { sendDenialEmail } = require('./email-services/service-types/deny');
const { sendCancellationEmail } = require('./email-services/service-types/cancel');
const { sendAdminNotificationEmail } = require('./email-services/service-types/notify');
const { sendConfirmationEmail } = require('./email-services/service-types/confirm');

const createAppointment = async (appointmentData) => {
    const newAppointment = await appointmentRepo.create(appointmentData);
    
    if (newAppointment) {
        await sendAdminNotificationEmail(newAppointment);
        await sendConfirmationEmail(newAppointment)
    }
    
    return newAppointment;
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

const denyAppointment = async (id, message) => {
    const appointment = await appointmentRepo.findById(id);
    if (!appointment) return false;

    const isDeleted = await appointmentRepo.deleteAppointment(id);

    if (isDeleted) {
        await sendDenialEmail(appointment, message);
    }

    return isDeleted;
};

const cancelAppointment = async (id, message) => {
    const appointment = await appointmentRepo.findById(id);
    if (!appointment) return false;

    const isDeleted = await appointmentRepo.deleteAppointment(id);

    if (isDeleted) {
        await sendCancellationEmail(appointment, message);
    }

    return isDeleted;
};

const approveAppointment = async (id, message) => {
    const updatedAppointment = await appointmentRepo.update(id, { approved: true });
    
    if (updatedAppointment) {
        await sendApprovalEmail(updatedAppointment, message);
    }
    
    return updatedAppointment;
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    denyAppointment,
    cancelAppointment,
    approveAppointment
};