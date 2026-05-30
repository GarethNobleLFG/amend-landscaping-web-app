const serviceService = require('../../src/services/serviceService');
const Service = require('../../src/models/services');

jest.mock('../../src/models/services');

describe('Service Business Logic (Service Layer)', () => {
    let mockService;

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, 'error').mockImplementation(() => { });

        mockService = {
            id: 1,
            description: 'Lawn Mowing',
            is_available: true,
            save: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn()
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Creating a Service', () => {
        it('should successfully create a new service and return success message', async () => {
            Service.create.mockResolvedValue(mockService);

            const result = await serviceService.createService('Lawn Mowing', true);

            expect(Service.create).toHaveBeenCalledWith({ description: 'Lawn Mowing', is_available: true });
            expect(result.success).toBe(true);
            expect(result.data.id).toBe(1);
            expect(result.data.description).toBe('Lawn Mowing');
        });

        it('should create a service with is_available defaulting to true', async () => {
            Service.create.mockResolvedValue({ ...mockService, is_available: true });

            const result = await serviceService.createService('Tree Trimming');

            expect(Service.create).toHaveBeenCalledWith({ description: 'Tree Trimming', is_available: true });
            expect(result.data.is_available).toBe(true);
        });

        it('should throw an error if creation fails', async () => {
            Service.create.mockRejectedValue(new Error('Database constraint error'));

            await expect(serviceService.createService('Lawn Mowing', true)).rejects.toThrow('Database constraint error');
        });
    });

    describe('Fetching All Services', () => {
        it('should return all services including unavailable ones', async () => {
            const allServices = [
                { id: 1, description: 'Lawn Mowing', is_available: true },
                { id: 2, description: 'Tree Trimming', is_available: false }
            ];
            Service.findAll.mockResolvedValue(allServices);

            const result = await serviceService.getAllServices();

            expect(Service.findAll).toHaveBeenCalledWith();
            expect(result).toHaveLength(2);
            expect(result[1].is_available).toBe(false);
        });

        it('should return an empty array if no services exist', async () => {
            Service.findAll.mockResolvedValue([]);

            const result = await serviceService.getAllServices();

            expect(result).toEqual([]);
        });

        it('should throw an error if database query fails', async () => {
            Service.findAll.mockRejectedValue(new Error('Database connection error'));

            await expect(serviceService.getAllServices()).rejects.toThrow('Database connection error');
        });
    });

    describe('Fetching Available Services', () => {
        it('should return only available services', async () => {
            const availableServices = [
                { id: 1, description: 'Lawn Mowing', is_available: true },
                { id: 3, description: 'Landscaping', is_available: true }
            ];
            Service.findAll.mockResolvedValue(availableServices);

            const result = await serviceService.getAvailableServices();

            expect(Service.findAll).toHaveBeenCalledWith({ where: { is_available: true } });
            expect(result).toHaveLength(2);
            expect(result.every(s => s.is_available)).toBe(true);
        });

        it('should return an empty array if no available services exist', async () => {
            Service.findAll.mockResolvedValue([]);

            const result = await serviceService.getAvailableServices();

            expect(result).toEqual([]);
        });

        it('should throw an error if database query fails', async () => {
            Service.findAll.mockRejectedValue(new Error('Database connection error'));

            await expect(serviceService.getAvailableServices()).rejects.toThrow('Database connection error');
        });
    });

    describe('Fetching a Service by ID', () => {
        it('should return the service when found', async () => {
            Service.findByPk.mockResolvedValue(mockService);

            const result = await serviceService.getServiceById(1);

            expect(Service.findByPk).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
            expect(result.description).toBe('Lawn Mowing');
        });

        it('should return null if the service does not exist', async () => {
            Service.findByPk.mockResolvedValue(null);

            const result = await serviceService.getServiceById(999);

            expect(result).toBeNull();
        });

        it('should throw an error if database query fails', async () => {
            Service.findByPk.mockRejectedValue(new Error('Database error'));

            await expect(serviceService.getServiceById(1)).rejects.toThrow('Database error');
        });
    });

    describe('Updating a Service', () => {
        it('should successfully update a service and return the updated service', async () => {
            mockService.update.mockImplementation(async (updates) => {
                Object.assign(mockService, updates);
                return mockService;
            });
            Service.findByPk.mockResolvedValue(mockService);

            const result = await serviceService.updateService(1, 'Updated Lawn Mowing', false);

            expect(Service.findByPk).toHaveBeenCalledWith(1);
            expect(mockService.update).toHaveBeenCalledWith({ description: 'Updated Lawn Mowing', is_available: false });
            expect(result.description).toBe('Updated Lawn Mowing');
            expect(result.is_available).toBe(false);
        });

        it('should return null if the service to update does not exist', async () => {
            Service.findByPk.mockResolvedValue(null);

            const result = await serviceService.updateService(999, 'Description', true);

            expect(result).toBeNull();
        });

        it('should throw an error if update operation fails', async () => {
            mockService.update.mockRejectedValue(new Error('Update failed'));
            Service.findByPk.mockResolvedValue(mockService);

            await expect(serviceService.updateService(1, 'New Description', true)).rejects.toThrow('Update failed');
        });
    });

    describe('Deleting a Service', () => {
        it('should successfully delete a service and return true', async () => {
            mockService.destroy.mockResolvedValue();
            Service.findByPk.mockResolvedValue(mockService);

            const result = await serviceService.deleteService(1);

            expect(Service.findByPk).toHaveBeenCalledWith(1);
            expect(mockService.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return null if the service to delete does not exist', async () => {
            Service.findByPk.mockResolvedValue(null);

            const result = await serviceService.deleteService(999);

            expect(result).toBeNull();
        });

        it('should throw an error if delete operation fails', async () => {
            mockService.destroy.mockRejectedValue(new Error('Delete failed'));
            Service.findByPk.mockResolvedValue(mockService);

            await expect(serviceService.deleteService(1)).rejects.toThrow('Delete failed');
        });
    });
});
