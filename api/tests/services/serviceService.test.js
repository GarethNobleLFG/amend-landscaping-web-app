const serviceService = require('../../src/services/serviceService');
const serviceRepo = require('../../src/repositories/serviceRepository');

jest.mock('../../src/repositories/serviceRepository');

describe('Service Business Logic (Service Layer)', () => {
    let mockService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });

        mockService = {
            id: 1,
            name: 'Lawn Mowing',
            description: 'Lawn mowing and edging service',
            is_available: true,
            image_id: 'uuid-1234',
            save: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn()
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Creating a Service', () => {
        it('should successfully create a new service', async () => {
            serviceRepo.create.mockResolvedValue(mockService);

            const result = await serviceService.createService('Lawn Mowing', 'Lawn mowing and edging service', true, 'uuid-1234');

            expect(serviceRepo.create).toHaveBeenCalledWith({ name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true, image_id: 'uuid-1234' });
            expect(result.id).toBe(1);
            expect(result.name).toBe('Lawn Mowing');
        });

        it('should throw an error if creation fails', async () => {
            serviceRepo.create.mockRejectedValue(new Error('Database error'));
            await expect(serviceService.createService('Lawn Mowing', 'Lawn mowing', true)).rejects.toThrow('Database error');
        });
    });

    describe('Fetching All Services', () => {
        it('should return all services', async () => {
            serviceRepo.findAll.mockResolvedValue([mockService]);
            const result = await serviceService.getAllServices();
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Lawn Mowing');
        });
    });

    describe('Updating a Service', () => {
        it('should successfully update a service', async () => {
            serviceRepo.update.mockResolvedValue({ ...mockService, name: 'Updated' });
            const result = await serviceService.updateService(1, 'Updated', 'Desc', false, 'new-uuid');
            expect(result.name).toBe('Updated');
        });
    });

    describe('Deleting a Service', () => {
        it('should successfully delete a service', async () => {
            serviceRepo.deleteService.mockResolvedValue(true);
            const result = await serviceService.deleteService(1);
            expect(result).toBe(true);
        });
    });
});