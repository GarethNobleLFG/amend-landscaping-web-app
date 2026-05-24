const request = require('supertest');
const express = require('express');
const appointmentRoutes = require('../../src/routes/appointmentRoutes');
const appointmentService = require('../../src/services/appointmentService');

// Mock auth middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => next(),
    requireAdmin: (req, res, next) => next()
}));

// Mock the Service layer so we test the real Controller logic
jest.mock('../../src/services/appointmentService');

describe('Appointment Controller Logic', () => {
    let app;
    let mockAppointment;

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, 'error').mockImplementation(() => {});

        app = express();
        app.use(express.json());
        app.use('/appointments', appointmentRoutes);

        mockAppointment = { id: 123, service: 'Mowing', approved: false };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Scheduling a New Appointment', () => {
        it('should return 201 and the new record when creation is successful', async () => {
            // Tell the mock service to return our mock appointment
            appointmentService.createAppointment.mockResolvedValue(mockAppointment);

            const res = await request(app)
                .post('/appointments')
                .send({ service: 'Mowing' });

            expect(appointmentService.createAppointment).toHaveBeenCalledWith({ service: 'Mowing' });
            expect(res.status).toBe(201);
            expect(res.body.id).toBe(123);
        });

        it('should return 500 if the service throws an error during creation', async () => {
            appointmentService.createAppointment.mockRejectedValue(new Error('Database Error'));

            const res = await request(app)
                .post('/appointments')
                .send({ service: 'Mowing' });

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to create appointment');
        });
    });

    describe('Viewing the Appointment Schedule', () => {
        it('should return 200 and a complete list of all booked appointments', async () => {
            appointmentService.getAllAppointments.mockResolvedValue([mockAppointment]);

            const res = await request(app).get('/appointments');

            expect(appointmentService.getAllAppointments).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.body[0].id).toBe(123);
        });
    });

    describe('Looking up a Specific Appointment', () => {
        it('should return 200 and details when an appointment is found', async () => {
            appointmentService.getAppointmentById.mockResolvedValue(mockAppointment);

            const res = await request(app).get('/appointments/123');

            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith('123');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(123);
        });

        it('should return 404 when the appointment does not exist', async () => {
            appointmentService.getAppointmentById.mockResolvedValue(null);

            const res = await request(app).get('/appointments/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Appointment not found');
        });
    });

    describe('Managing Pending Appointments (Approve)', () => {
        it('should return 200 and update status when approving a pending appointment', async () => {
            const approvedAppointment = { ...mockAppointment, approved: true };
            appointmentService.approveAppointment.mockResolvedValue(approvedAppointment);

            const res = await request(app).patch('/appointments/123/approve');

            expect(appointmentService.approveAppointment).toHaveBeenCalledWith('123');
            expect(res.status).toBe(200);
            expect(res.body.appointment.approved).toBe(true);
        });

        it('should return 404 if trying to approve an appointment that does not exist', async () => {
            appointmentService.approveAppointment.mockResolvedValue(null);

            const res = await request(app).patch('/appointments/999/approve');

            expect(res.status).toBe(404);
        });
    });

    describe('Canceling an Appointment', () => {
        it('should return 200 when an appointment is successfully deleted', async () => {
            appointmentService.deleteAppointment.mockResolvedValue(true);

            const res = await request(app).delete('/appointments/123');

            expect(appointmentService.deleteAppointment).toHaveBeenCalledWith('123');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Appointment deleted successfully');
        });

        it('should return 404 if the appointment to delete is not found', async () => {
            appointmentService.deleteAppointment.mockResolvedValue(false);

            const res = await request(app).delete('/appointments/999');

            expect(res.status).toBe(404);
        });
    });
});