const testimonyService = require('../../src/services/testimonyService');
const testimonyRepo = require('../../src/repositories/testimonyRepository');

jest.mock('../../src/repositories/testimonyRepository');

describe('Testimony Service', () => {
    let mockTestimony;

    beforeEach(() => {
        jest.clearAllMocks();
        mockTestimony = {
            id: 'uuid-123',
            name: 'John Doe',
            quote: 'Amazing service!',
            createdAt: new Date()
        };
    });

    describe('addTestimony', () => {
        it('should successfully add a testimony', async () => {
            testimonyRepo.create.mockResolvedValue(mockTestimony);

            const result = await testimonyService.addTestimony('John Doe', 'Amazing service!');

            expect(testimonyRepo.create).toHaveBeenCalledWith({ name: 'John Doe', quote: 'Amazing service!' });
            expect(result).toEqual(mockTestimony);
        });

        it('should throw error if name or quote is missing', async () => {
            await expect(testimonyService.addTestimony('', 'Some quote'))
                .rejects.toThrow('Name and quote are required');
            
            await expect(testimonyService.addTestimony('John Doe', ''))
                .rejects.toThrow('Name and quote are required');
        });
    });

    describe('getAllTestimonies', () => {
        it('should return all testimonies from repo', async () => {
            testimonyRepo.findAll.mockResolvedValue([mockTestimony]);

            const result = await testimonyService.getAllTestimonies();

            expect(testimonyRepo.findAll).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockTestimony);
        });
    });

    describe('removeTestimony', () => {
        it('should successfully delete a testimony', async () => {
            testimonyRepo.deleteById.mockResolvedValue(true);

            const result = await testimonyService.removeTestimony('uuid-123');

            expect(testimonyRepo.deleteById).toHaveBeenCalledWith('uuid-123');
            expect(result).toBe(true);
        });
    });
});