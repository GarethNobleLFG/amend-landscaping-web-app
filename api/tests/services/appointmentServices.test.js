const appointmentService = require('../../src/services/appointmentService');
const appointmentRepo = require('../../src/repositories/appointmentRepository');

jest.mock('../../src/repositories/appointmentRepository');

describe('Appointment Business Logic (Service)', () => {
    let mockAppointment;

    beforeEach(() => {
        jest.clearAllMocks();
        mockAppointment = { id: 1, service: 'Mowing', approved: false };
    });

    describe('Handling New Appointments', () => {
        it('should correctly pass appointment data to the repository for creation', async () => {
            const dataToCreate = { service: 'Mowing' };
            appointmentRepo.create.mockResolvedValue(mockAppointment);

            const result = await appointmentService.createAppointment(dataToCreate);

            expect(appointmentRepo.create).toHaveBeenCalledWith(dataToCreate);
            expect(result).toEqual(mockAppointment);
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
        it('should correctly pass update data to the repository', async () => {
            const updateProps = { service: 'Weeding' };
            const updatedAppointment = { ...mockAppointment, ...updateProps };
            appointmentRepo.update.mockResolvedValue(updatedAppointment);

            const result = await appointmentService.updateAppointment(1, updateProps);

            expect(appointmentRepo.update).toHaveBeenCalledWith(1, updateProps);
            expect(result).toEqual(updatedAppointment);
        });

        it('should enforce the business rule of setting approved to true when approving', async () => {
            const approvedAppointment = { ...mockAppointment, approved: true };
            appointmentRepo.update.mockResolvedValue(approvedAppointment);

            const result = await appointmentService.approveAppointment(1);

            expect(appointmentRepo.update).toHaveBeenCalledWith(1, { approved: true });
            expect(result).toEqual(approvedAppointment);
        });
    });

    describe('Removing Appointments', () => {
        it('should correctly process denying an appointment', async () => {
            appointmentRepo.deleteAppointment.mockResolvedValue(true);

            const result = await appointmentService.denyAppointment(1);

            expect(appointmentRepo.deleteAppointment).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });

        it('should correctly process canceling an appointment', async () => {
            appointmentRepo.deleteAppointment.mockResolvedValue(true);

            const result = await appointmentService.cancelAppointment(1);

            expect(appointmentRepo.deleteAppointment).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });
    });
});
