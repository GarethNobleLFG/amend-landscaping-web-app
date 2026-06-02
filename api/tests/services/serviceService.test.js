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
            image: 'base64imagestring',
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
            serviceRepo.create.mockResolvedValue(mockService);

            const result = await serviceService.createService('Lawn Mowing', 'Lawn mowing and edging service', true, 'base64imagestring');

            expect(serviceRepo.create).toHaveBeenCalledWith({ name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true, image: 'base64imagestring' });
            expect(result.success).toBe(true);
            expect(result.data.id).toBe(1);
            expect(result.data.name).toBe('Lawn Mowing');
            expect(result.data.description).toBe('Lawn mowing and edging service');
            expect(result.data.image).toBe('base64imagestring');
        });

        it('should create a service with is_available defaulting to true and image to null', async () => {
            const basicService = { ...mockService, image: null };
            serviceRepo.create.mockResolvedValue(basicService);

            const result = await serviceService.createService('Tree Trimming', 'Tree trimming and removal service');

            expect(serviceRepo.create).toHaveBeenCalledWith({ name: 'Tree Trimming', description: 'Tree trimming and removal service', is_available: true, image: null });
            expect(result.data.is_available).toBe(true);
            expect(result.data.image).toBeNull();
        });

        it('should successfully store a very large base64 image string (compression check)', async () => {
            // Emulate a compressed base64 string (starts with data:image/webp)
            const webpImagePayload = 'data:image/webp;base64,UklGRq4CAABXRUJQVlA4T...';
            const expectedService = { ...mockService, image: webpImagePayload };
            serviceRepo.create.mockResolvedValue(expectedService);

            const result = await serviceService.createService('Mowing', 'Fast mowing', true, webpImagePayload);

            expect(serviceRepo.create).toHaveBeenCalledWith({
                name: 'Mowing',
                description: 'Fast mowing',
                is_available: true,
                image: webpImagePayload
            });
            expect(result.data.image).toBe(webpImagePayload);
        });

        it('should throw an error if creation fails', async () => {
            serviceRepo.create.mockRejectedValue(new Error('Database constraint error'));

            await expect(serviceService.createService('Lawn Mowing', 'Lawn mowing and edging service', true)).rejects.toThrow('Database constraint error');
        });
    });

    describe('Fetching All Services', () => {
        it('should return all services including unavailable ones', async () => {
            const allServices = [
                { id: 1, name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true, image: 'img1' },
                { id: 2, name: 'Tree Trimming', description: 'Tree trimming and removal service', is_available: false, image: null }
            ];
            serviceRepo.findAll.mockResolvedValue(allServices);

            const result = await serviceService.getAllServices();

            expect(serviceRepo.findAll).toHaveBeenCalledWith();
            expect(result).toHaveLength(2);
            expect(result[1].is_available).toBe(false);
            expect(result[0].image).toBe('img1');
        });

        it('should return an empty array if no services exist', async () => {
            serviceRepo.findAll.mockResolvedValue([]);

            const result = await serviceService.getAllServices();

            expect(result).toEqual([]);
        });

        it('should throw an error if database query fails', async () => {
            serviceRepo.findAll.mockRejectedValue(new Error('Database connection error'));

            await expect(serviceService.getAllServices()).rejects.toThrow('Database connection error');
        });
    });

    describe('Fetching Available Services', () => {
        it('should return only available services', async () => {
            const availableServices = [
                { id: 1, name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true, image: 'img1' },
                { id: 3, name: 'Landscaping', description: 'Full landscaping design service', is_available: true, image: null }
            ];
            serviceRepo.findAvailable.mockResolvedValue(availableServices);

            const result = await serviceService.getAvailableServices();

            expect(serviceRepo.findAvailable).toHaveBeenCalledWith();
            expect(result).toHaveLength(2);
            expect(result.every(s => s.is_available)).toBe(true);
        });

        it('should return an empty array if no available services exist', async () => {
            serviceRepo.findAvailable.mockResolvedValue([]);

            const result = await serviceService.getAvailableServices();

            expect(result).toEqual([]);
        });

        it('should throw an error if database query fails', async () => {
            serviceRepo.findAvailable.mockRejectedValue(new Error('Database connection error'));

            await expect(serviceService.getAvailableServices()).rejects.toThrow('Database connection error');
        });
    });

    describe('Fetching a Service by ID', () => {
        it('should return the service when found', async () => {
            serviceRepo.findById.mockResolvedValue(mockService);

            const result = await serviceService.getServiceById(1);

            expect(serviceRepo.findById).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
            expect(result.name).toBe('Lawn Mowing');
        });

        it('should return null if the service does not exist', async () => {
            serviceRepo.findById.mockResolvedValue(null);

            const result = await serviceService.getServiceById(999);

            expect(result).toBeNull();
        });

        it('should throw an error if database query fails', async () => {
            serviceRepo.findById.mockRejectedValue(new Error('Database error'));

            await expect(serviceService.getServiceById(1)).rejects.toThrow('Database error');
        });
    });

    describe('Updating a Service', () => {
        it('should successfully update a service and return the updated service', async () => {
            const updatedService = { ...mockService, name: 'Updated Lawn Mowing', image: 'newimage' };
            serviceRepo.update.mockResolvedValue(updatedService);

            const result = await serviceService.updateService(1, 'Updated Lawn Mowing', 'Updated description', false, 'newimage');

            expect(serviceRepo.update).toHaveBeenCalledWith(1, { name: 'Updated Lawn Mowing', description: 'Updated description', is_available: false, image: 'newimage' });
            expect(result.name).toBe('Updated Lawn Mowing');
            expect(result.image).toBe('newimage');
        });

        it('should allow removing an image by setting the value to null on service update', async () => {
            const updatedService = { ...mockService, image: null };
            serviceRepo.update.mockResolvedValue(updatedService);

            const result = await serviceService.updateService(1, 'Lawn Mowing', 'Updated desc', true, null);

            expect(serviceRepo.update).toHaveBeenCalledWith(1, {
                name: 'Lawn Mowing',
                description: 'Updated desc',
                is_available: true,
                image: null
            });
            expect(result.image).toBeNull();
        });

        it('should return null if the service to update does not exist', async () => {
            serviceRepo.update.mockResolvedValue(null);

            const result = await serviceService.updateService(999, 'Updated Service', 'Updated description', true, 'image');

            expect(result).toBeNull();
        });

        it('should throw an error if update operation fails', async () => {
            serviceRepo.update.mockRejectedValue(new Error('Update failed'));

            await expect(serviceService.updateService(1, 'New Name', 'New Description', true, 'img')).rejects.toThrow('Update failed');
        });
    });

    describe('Deleting a Service', () => {
        it('should successfully delete a service and return true', async () => {
            serviceRepo.deleteService.mockResolvedValue(true);

            const result = await serviceService.deleteService(1);

            expect(serviceRepo.deleteService).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });

        it('should return false if the service to delete does not exist', async () => {
            serviceRepo.deleteService.mockResolvedValue(false);

            const result = await serviceService.deleteService(999);

            expect(result).toBe(false);
        });

        it('should throw an error if delete operation fails', async () => {
            serviceRepo.deleteService.mockRejectedValue(new Error('Delete failed'));

            await expect(serviceService.deleteService(1)).rejects.toThrow('Delete failed');
        });
    });
});