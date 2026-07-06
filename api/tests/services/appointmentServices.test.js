const appointmentService = require('../../src/services/appointmentService');
const appointmentRepo = require('../../src/repositories/appointmentRepository');
const contactService = require('../../src/services/contactService');

jest.mock('../../src/repositories/appointmentRepository');

jest.mock('../../src/services/email-services/service-types/approve', () => ({ sendApprovalEmail: jest.fn() }));
jest.mock('../../src/services/email-services/service-types/deny', () => ({ sendDenialEmail: jest.fn() }));
jest.mock('../../src/services/email-services/service-types/cancel', () => ({ sendCancellationEmail: jest.fn() }));
jest.mock('../../src/services/email-services/service-types/notify', () => ({ sendAdminNotificationEmail: jest.fn() }));
jest.mock('../../src/services/email-services/service-types/confirm', () => ({ sendConfirmationEmail: jest.fn() }));
jest.mock('../../src/services/contactService');

const { sendApprovalEmail } = require('../../src/services/email-services/service-types/approve');
const { sendDenialEmail } = require('../../src/services/email-services/service-types/deny');
const { sendCancellationEmail } = require('../../src/services/email-services/service-types/cancel');
const { sendAdminNotificationEmail } = require('../../src/services/email-services/service-types/notify');
const { sendConfirmationEmail } = require('../../src/services/email-services/service-types/confirm');

describe('Appointment Business Logic (Service)', () => {
    let mockAppointment;

    beforeEach(() => {
        jest.clearAllMocks();
        mockAppointment = { id: 1, service: 'Mowing', approved: false, is_commercial: false };
    });

    describe('Handling New Appointments', () => {
        it('should create an appointment and trigger contact creation + emails', async () => {
            const dataToCreate = { name: 'John Doe', email: 'john@example.com', phoneNumber: '555-5555' };
            appointmentRepo.create.mockResolvedValue({ id: 1, ...dataToCreate });

            await appointmentService.createAppointment(dataToCreate);

            expect(contactService.createContact).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                phoneNumber: '555-5555'
            });
            expect(sendAdminNotificationEmail).toHaveBeenCalled();
        });

        it('should handle commercial status correctly when creating an appointment', async () => {
            const dataToCreate = { service: 'Lawn Care', is_commercial: true };
            const commercialAppointment = { ...mockAppointment, is_commercial: true };
            appointmentRepo.create.mockResolvedValue(commercialAppointment);

            const result = await appointmentService.createAppointment(dataToCreate);

            expect(appointmentRepo.create).toHaveBeenCalledWith(dataToCreate);
            expect(result.is_commercial).toBe(true);
        });

        it('should not trigger email services if appointment creation fails', async () => {
            const dataToCreate = { service: 'Mowing' };
            appointmentRepo.create.mockResolvedValue(null);

            const result = await appointmentService.createAppointment(dataToCreate);

            expect(appointmentRepo.create).toHaveBeenCalledWith(dataToCreate);
            expect(sendAdminNotificationEmail).not.toHaveBeenCalled();
            expect(sendConfirmationEmail).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('Handling New Appointments with existing contact', () => {
        it('should return the appointment correctly even if the associated contact is a duplicate', async () => {
            const dataToCreate = { name: 'John Doe', email: 'john@example.com', phoneNumber: '555-5555' };
            const existingContact = { id: 1, ...dataToCreate };

            // 1. Mock the responses
            appointmentRepo.create.mockResolvedValue({ id: 10, ...dataToCreate });
            contactService.createContact.mockResolvedValue(existingContact);

            // 2. Run the service
            const result = await appointmentService.createAppointment(dataToCreate);

            // 3. Confirm the logic flow worked
            expect(result.id).toBe(10);
            expect(contactService.createContact).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                phoneNumber: '555-5555'
            });

            // This is the "Verification": We confirm it still sends emails 
            // even if the contact was already in our system.
            expect(sendAdminNotificationEmail).toHaveBeenCalled();
            expect(sendConfirmationEmail).toHaveBeenCalled();
        });
    });

    describe('Retrieving Appointments', () => {
        it('should fetch all appointments from the repository', async () => {
            appointmentRepo.findAll.mockResolvedValue([mockAppointment]);

            const result = await appointmentService.getAllAppointments();

            expect(appointmentRepo.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockAppointment]);
        });

        it('should fetch a single appointment from the repository by its ID', async () => {
            appointmentRepo.findById.mockResolvedValue(mockAppointment);

            const result = await appointmentService.getAppointmentById(1);

            expect(appointmentRepo.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockAppointment);
        });
    });

    describe('Modifying Appointments', () => {
        it('should enforce business rule of setting approved to true and send the approval email with custom message', async () => {
            const customMessage = 'Looking forward to seeing you!';
            const approvedAppointment = { ...mockAppointment, approved: true };
            appointmentRepo.update.mockResolvedValue(approvedAppointment);

            const result = await appointmentService.approveAppointment(1, customMessage);

            expect(appointmentRepo.update).toHaveBeenCalledWith(1, { approved: true });
            expect(sendApprovalEmail).toHaveBeenCalledWith(approvedAppointment, customMessage);
            expect(result).toEqual(approvedAppointment);
        });

        it('should not send approval email if the appointment update fails or is not found', async () => {
            appointmentRepo.update.mockResolvedValue(null);

            const result = await appointmentService.approveAppointment(999, 'Welcome!');

            expect(appointmentRepo.update).toHaveBeenCalledWith(999, { approved: true });
            expect(sendApprovalEmail).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('markAsSeen', () => {
        it('should successfully mark appointment as seen', async () => {
            appointmentRepo.updateSeenStatus.mockResolvedValue({ id: '123', is_seen: true });
            const result = await appointmentService.markAsSeen('123');
            expect(result.is_seen).toBe(true);
        });
    });

    describe('Archiving Appointments', () => {
        it('should mark an appointment as archived in the repository', async () => {
            const archivedAppointment = { ...mockAppointment, is_archived: true };
            appointmentRepo.update.mockResolvedValue(archivedAppointment);

            const result = await appointmentService.archiveAppointment(1);

            expect(appointmentRepo.update).toHaveBeenCalledWith(1, { is_archived: true });
            expect(result.is_archived).toBe(true);
        });

        it('should return null if the appointment to archive does not exist', async () => {
            appointmentRepo.update.mockResolvedValue(null);

            const result = await appointmentService.archiveAppointment(999);

            expect(result).toBeNull();
        });
    });

    describe('Removing Appointments', () => {
        it('should fetch, delete, and send denial email with custom message', async () => {
            const customMessage = 'Too busy right now.';
            appointmentRepo.findById.mockResolvedValue(mockAppointment);
            appointmentRepo.deleteAppointment.mockResolvedValue(true);

            const result = await appointmentService.denyAppointment(1, customMessage);

            expect(appointmentRepo.findById).toHaveBeenCalledWith(1);
            expect(appointmentRepo.deleteAppointment).toHaveBeenCalledWith(1);
            expect(sendDenialEmail).toHaveBeenCalledWith(mockAppointment, customMessage);
            expect(result).toBe(true);
        });

        it('should not send denial email or delete if the appointment is not found', async () => {
            appointmentRepo.findById.mockResolvedValue(null);

            const result = await appointmentService.denyAppointment(999, 'Sorry!');

            expect(appointmentRepo.findById).toHaveBeenCalledWith(999);
            expect(appointmentRepo.deleteAppointment).not.toHaveBeenCalled();
            expect(sendDenialEmail).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });

        it('should not send denial email if the found appointment deletion fails', async () => {
            appointmentRepo.findById.mockResolvedValue(mockAppointment);
            appointmentRepo.deleteAppointment.mockResolvedValue(false);

            const result = await appointmentService.denyAppointment(1, 'Error on delete');

            expect(appointmentRepo.findById).toHaveBeenCalledWith(1);
            expect(appointmentRepo.deleteAppointment).toHaveBeenCalledWith(1);
            expect(sendDenialEmail).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });

        it('should fetch, delete, and send cancellation email with custom message', async () => {
            const customMessage = 'Forecast says rain.';
            appointmentRepo.findById.mockResolvedValue(mockAppointment);
            appointmentRepo.deleteAppointment.mockResolvedValue(true);

            const result = await appointmentService.cancelAppointment(1, customMessage);

            expect(appointmentRepo.findById).toHaveBeenCalledWith(1);
            expect(appointmentRepo.deleteAppointment).toHaveBeenCalledWith(1);
            expect(sendCancellationEmail).toHaveBeenCalledWith(mockAppointment, customMessage);
            expect(result).toBe(true);
        });

        it('should not send cancellation email or delete if the appointment is not found', async () => {
            appointmentRepo.findById.mockResolvedValue(null);

            const result = await appointmentService.cancelAppointment(999, 'Cancellation failed');

            expect(appointmentRepo.findById).toHaveBeenCalledWith(999);
            expect(appointmentRepo.deleteAppointment).not.toHaveBeenCalled();
            expect(sendCancellationEmail).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });

        it('should not send cancellation email if the found appointment deletion fails', async () => {
            appointmentRepo.findById.mockResolvedValue(mockAppointment);
            appointmentRepo.deleteAppointment.mockResolvedValue(false);

            const result = await appointmentService.cancelAppointment(1, 'Error on cancel');

            expect(appointmentRepo.findById).toHaveBeenCalledWith(1);
            expect(appointmentRepo.deleteAppointment).toHaveBeenCalledWith(1);
            expect(sendCancellationEmail).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });
});