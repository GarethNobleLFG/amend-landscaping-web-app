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

// PATCH /appointments/:id/deny
const deny = async (req, res) => {
    try {
        const { message } = req.body; 
        const success = await appointmentService.denyAppointment(req.params.id, message);

        if (!success) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment denied' });
    }
    catch (error) {
        console.error('Error denying appointment:', error);
        res.status(500).json({ error: 'Failed to deny appointment' });
    }
};

// PATCH /appointments/:id/cancel
const cancel = async (req, res) => {
    try {
        const { message } = req.body; 
        const success = await appointmentService.cancelAppointment(req.params.id, message);

        if (!success) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment cancelled' });
    }
    catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
};

// PATCH /appointments/:id/approve
const approve = async (req, res) => {
    try {
        const { message } = req.body; 
        
        const updatedAppointment = await appointmentService.approveAppointment(req.params.id, message);

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
    deny,
    cancel,
    approve
};
