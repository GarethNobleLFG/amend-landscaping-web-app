
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
            description: 'Professional lawn care',
            is_available: true,
            image_id: '123e4567-e89b-12d3-a456-426614174000',
            listing_rank: 0
        };
    });

    describe('createService', () => {
        it('should successfully create a service with all fields', async () => {
            serviceRepo.create.mockResolvedValue(mockService);

            const result = await serviceService.createService(
                'Lawn Mowing', 'Professional lawn care', true, '123e4567-e89b-12d3-a456-426614174000'
            );

            expect(result).toEqual(mockService);
            expect(serviceRepo.create).toHaveBeenCalledWith({
                name: 'Lawn Mowing',
                description: 'Professional lawn care',
                is_available: true,
                image_id: '123e4567-e89b-12d3-a456-426614174000',
                listing_rank: 0 
            });
        });

        it('should sanitize empty string image_id to null', async () => {
            serviceRepo.create.mockResolvedValue({ ...mockService, image_id: null });

            await serviceService.createService('Lawn Mowing', 'Desc', true, '');

            expect(serviceRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                image_id: null
            }));
        });

        it('should apply default value for is_available if not provided', async () => {
            await serviceService.createService('Lawn Mowing', 'Desc');

            expect(serviceRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                is_available: true
            }));
        });
    });

    describe('getAvailableServices', () => {
        it('should return only available services from the repository', async () => {
            serviceRepo.findAvailable.mockResolvedValue([mockService]);

            const result = await serviceService.getAvailableServices();

            expect(result).toHaveLength(1);
            expect(serviceRepo.findAvailable).toHaveBeenCalled();
        });
    });

    describe('getServiceById', () => {
        it('should return a service if it exists', async () => {
            serviceRepo.findById.mockResolvedValue(mockService);

            const result = await serviceService.getServiceById(1);

            expect(result).toEqual(mockService);
            expect(serviceRepo.findById).toHaveBeenCalledWith(1);
        });

        it('should return null if the service does not exist', async () => {
            serviceRepo.findById.mockResolvedValue(null);

            const result = await serviceService.getServiceById(999);

            expect(result).toBeNull();
        });
    });

    describe('updateService', () => {
        it('should successfully update a service including listing_rank', async () => {
            const updatedService = { ...mockService, name: 'Lawn Care Pro', listing_rank: 10 };
            serviceRepo.update.mockResolvedValue(updatedService);

            const result = await serviceService.updateService(1, 'Lawn Care Pro', 'Desc', true, 'uuid', 10);

            expect(result.listing_rank).toBe(10);
            expect(serviceRepo.update).toHaveBeenCalledWith(1, expect.objectContaining({
                name: 'Lawn Care Pro',
                listing_rank: 10
            }));
        });

        it('should sanitize empty string image_id to null while maintaining rank', async () => {
            await serviceService.updateService(1, 'Name', 'Desc', true, '', 5);

            expect(serviceRepo.update).toHaveBeenCalledWith(1, expect.objectContaining({
                image_id: null,
                listing_rank: 5
            }));
        });

        it('should return null if service to update is not found', async () => {
            serviceRepo.update.mockResolvedValue(null);

            const result = await serviceService.updateService(999, 'Name', 'Desc', true, 'uuid', 1);

            expect(result).toBeNull();
        });
    });

    describe('deleteService', () => {
        it('should return true on successful deletion', async () => {
            serviceRepo.deleteService.mockResolvedValue(true);

            const result = await serviceService.deleteService(1);

            expect(result).toBe(true);
            expect(serviceRepo.deleteService).toHaveBeenCalledWith(1);
        });

        it('should return false if service to delete was not found', async () => {
            serviceRepo.deleteService.mockResolvedValue(false);

            const result = await serviceService.deleteService(999);

            expect(result).toBe(false);
        });
    });
});