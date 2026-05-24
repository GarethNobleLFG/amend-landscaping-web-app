const appointmentService = require('../services/appointmentService');

// POST /appointments.
const create = async (req, res) => {
    try {
        const newAppointment = await appointmentService.createAppointment(req.body);
        res.status(201).json(newAppointment);
    }
    catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
};

// GET /appointments
const getAll = async (req, res) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        res.status(200).json(appointments);
    }
    catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

// GET /appointments/:id
const getById = async (req, res) => {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    }
    catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Failed to fetch appointment' });
    }
};

// PUT /appointments/:id
const update = async (req, res) => {
    try {
        const updatedAppointment = await appointmentService.updateAppointment(req.params.id, req.body);

        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json(updatedAppointment);
    }
    catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
};

// DELETE /appointments/:id
const remove = async (req, res) => {
    try {
        const success = await appointmentService.deleteAppointment(req.params.id);

        if (!success) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
};

// PATCH /appointments/:id/approve
const approve = async (req, res) => {
    try {
        const updatedAppointment = await appointmentService.approveAppointment(req.params.id);

        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment approved successfully', appointment: updatedAppointment });
    }
    catch (error) {
        console.error('Error approving appointment:', error);
        res.status(500).json({ error: 'Failed to approve appointment' });
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    approve
};