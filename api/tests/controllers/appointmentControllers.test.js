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

        jest.spyOn(console, 'error').mockImplementation(() => { });

        app = express();
        app.use(express.json());
        app.use('/appointments', appointmentRoutes);

        mockAppointment = { id: 123, service: 'Mowing', approved: false, is_commercial: false };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Scheduling a New Appointment', () => {
        it('should return 201 and the new record when creation is successful', async () => {
            appointmentService.createAppointment.mockResolvedValue(mockAppointment);

            const res = await request(app)
                .post('/appointments')
                .send({ service: 'Mowing' });

            expect(appointmentService.createAppointment).toHaveBeenCalledWith({ service: 'Mowing' });
            expect(res.status).toBe(201);
            expect(res.body.id).toBe(123);
        });

        it('should handle creating a commercial appointment successfully', async () => {
            const commercialAppointment = { ...mockAppointment, is_commercial: true };
            appointmentService.createAppointment.mockResolvedValue(commercialAppointment);

            const res = await request(app)
                .post('/appointments')
                .send({ service: 'Mowing', is_commercial: true });

            expect(appointmentService.createAppointment).toHaveBeenCalledWith({ service: 'Mowing', is_commercial: true });
            expect(res.status).toBe(201);
            expect(res.body.is_commercial).toBe(true);
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

        it('should return 500 if the service throws an error when fetching all appointments', async () => {
            appointmentService.getAllAppointments.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/appointments');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to fetch appointments');
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

        it('should return 500 if the service throws an error', async () => {
            appointmentService.getAppointmentById.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/appointments/123');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to fetch appointment');
        });
    });

    describe('Updating an Appointment Details (PUT)', () => {
        it('should return 200 and the updated appointment when update is successful', async () => {
            const updatedAppointment = { ...mockAppointment, service: 'Updated Service', is_commercial: true };
            appointmentService.updateAppointment.mockResolvedValue(updatedAppointment);

            const res = await request(app)
                .put('/appointments/123')
                .send({ service: 'Updated Service', is_commercial: true });

            expect(appointmentService.updateAppointment).toHaveBeenCalledWith('123', { service: 'Updated Service', is_commercial: true });
            expect(res.status).toBe(200);
            expect(res.body.service).toBe('Updated Service');
            expect(res.body.is_commercial).toBe(true);
        });

        it('should return 404 if the appointment to update does not exist', async () => {
            appointmentService.updateAppointment.mockResolvedValue(null);

            const res = await request(app)
                .put('/appointments/999')
                .send({ service: 'Updated Service' });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Appointment not found');
        });

        it('should return 500 if the service throws an error during update', async () => {
            appointmentService.updateAppointment.mockRejectedValue(new Error('Update Error'));

            const res = await request(app)
                .put('/appointments/123')
                .send({ service: 'Updated Service' });

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to update appointment');
        });
    });

    describe('Managing Pending Appointments (Approve)', () => {
        it('should return 200, update status, and pass custom message when approving', async () => {
            const approvedAppointment = { ...mockAppointment, approved: true };
            appointmentService.approveAppointment.mockResolvedValue(approvedAppointment);

            const res = await request(app)
                .patch('/appointments/123/approve')
                .send({ message: 'Great news! See you soon.' });

            expect(appointmentService.approveAppointment).toHaveBeenCalledWith('123', 'Great news! See you soon.');
            expect(res.status).toBe(200);
            expect(res.body.appointment.approved).toBe(true);
        });

        it('should fall back to an empty string if no message is provided on approval', async () => {
            const approvedAppointment = { ...mockAppointment, approved: true };
            appointmentService.approveAppointment.mockResolvedValue(approvedAppointment);

            const res = await request(app)
                .patch('/appointments/123/approve')
                .send({});

            expect(appointmentService.approveAppointment).toHaveBeenCalledWith('123', '');
            expect(res.status).toBe(200);
        });

        it('should return 404 if trying to approve an appointment that does not exist', async () => {
            appointmentService.approveAppointment.mockResolvedValue(null);

            const res = await request(app).patch('/appointments/999/approve');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Appointment not found');
        });

        it('should return 500 if the service throws an error during approval', async () => {
            appointmentService.approveAppointment.mockRejectedValue(new Error('Approval Error'));

            const res = await request(app).patch('/appointments/123/approve');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to approve appointment');
        });
    });

    describe('PATCH /appointments/:id/seen', () => {
        it('should return 200 when successful', async () => {
            appointmentService.markAsSeen.mockResolvedValue({ id: '123', is_seen: true });
            const res = await request(app).patch('/appointments/123/seen');
            expect(res.status).toBe(200);
        });
    });

    describe('Archiving Record', () => {
        it('should return 200 and the updated record when successfully archived', async () => {
            const archivedAppointment = { ...mockAppointment, id: 123, is_archived: true };
            appointmentService.archiveAppointment.mockResolvedValue(archivedAppointment);

            const res = await request(app)
                .patch('/appointments/123/archive');

            expect(appointmentService.archiveAppointment).toHaveBeenCalledWith('123');
            expect(res.status).toBe(200);
            expect(res.body.is_archived).toBe(true);
        });

        it('should return 404 if the appointment provided for archiving is not found', async () => {
            appointmentService.archiveAppointment.mockResolvedValue(null);

            const res = await request(app).patch('/appointments/999/archive');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Appointment not found');
        });

        it('should return 500 if the archive service throws an error', async () => {
            appointmentService.archiveAppointment.mockRejectedValue(new Error('DB failure'));

            const res = await request(app).patch('/appointments/123/archive');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to archive appointment');
        });
    });

    describe('Denying an Appointment', () => {
        it('should return 200 and pass custom message when an appointment is successfully denied', async () => {
            appointmentService.denyAppointment.mockResolvedValue(true);

            const res = await request(app)
                .patch('/appointments/123/deny')
                .send({ message: 'Unfortunately we are fully booked.' });

            expect(appointmentService.denyAppointment).toHaveBeenCalledWith('123', 'Unfortunately we are fully booked.');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Appointment denied');
        });

        it('should fall back to an empty string if no message is provided on denial', async () => {
            appointmentService.denyAppointment.mockResolvedValue(true);

            const res = await request(app)
                .patch('/appointments/123/deny')
                .send({});

            expect(appointmentService.denyAppointment).toHaveBeenCalledWith('123', '');
            expect(res.status).toBe(200);
        });

        it('should return 404 if the appointment to deny is not found', async () => {
            appointmentService.denyAppointment.mockResolvedValue(false);

            const res = await request(app).patch('/appointments/999/deny');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Appointment not found');
        });

        it('should return 500 if the service throws an error during denial', async () => {
            appointmentService.denyAppointment.mockRejectedValue(new Error('Deny Error'));

            const res = await request(app).patch('/appointments/123/deny');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to deny appointment');
        });
    });

    describe('Canceling an Appointment', () => {
        it('should return 200 and pass custom message when an appointment is successfully canceled', async () => {
            appointmentService.cancelAppointment.mockResolvedValue(true);

            const res = await request(app)
                .patch('/appointments/123/cancel')
                .send({ message: 'Weather cancel.' });

            expect(appointmentService.cancelAppointment).toHaveBeenCalledWith('123', 'Weather cancel.');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Appointment cancelled');
        });

        it('should fall back to an empty string if no message is provided on cancellation', async () => {
            appointmentService.cancelAppointment.mockResolvedValue(true);

            const res = await request(app)
                .patch('/appointments/123/cancel')
                .send({});

            expect(appointmentService.cancelAppointment).toHaveBeenCalledWith('123', '');
            expect(res.status).toBe(200);
        });

        it('should return 404 if the appointment to cancel is not found', async () => {
            appointmentService.cancelAppointment.mockResolvedValue(false);

            const res = await request(app).patch('/appointments/999/cancel');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Appointment not found');
        });

        it('should return 500 if the service throws an error during cancellation', async () => {
            appointmentService.cancelAppointment.mockRejectedValue(new Error('Cancellation Error'));

            const res = await request(app).patch('/appointments/123/cancel');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to cancel appointment');
        });
    });
});