const landingImageService = require('../../src/services/landingImageService');
const landingImageRepo = require('../../src/repositories/landingImageRepository');

jest.mock('../../src/repositories/landingImageRepository');

describe('Landing Image Service', () => {
    let mockLandingImage;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockLandingImage = {
            id: 'landing-uuid-1',
            image_id: 'registry-uuid-123',
            createdAt: new Date(),
            image: {
                image_data: 'base64-data-string'
            }
        };
    });

    describe('addLandingImage', () => {
        it('should successfully add a landing image', async () => {
            landingImageRepo.create.mockResolvedValue(mockLandingImage);

            const result = await landingImageService.addLandingImage('registry-uuid-123');

            expect(landingImageRepo.create).toHaveBeenCalledWith({ 
                image_id: 'registry-uuid-123' 
            });
            expect(result).toEqual(mockLandingImage);
        });

        it('should sanitize empty string image_id to null', async () => {
            landingImageRepo.create.mockImplementation((data) => {
                if (data.image_id === null) throw new Error('image_id is required');
                return Promise.resolve(mockLandingImage);
            });

            await expect(landingImageService.addLandingImage(''))
                .rejects.toThrow('image_id is required');
            
            expect(landingImageRepo.create).toHaveBeenCalledWith({ 
                image_id: null 
            });
        });

        it('should propagate repository errors on creation', async () => {
            landingImageRepo.create.mockRejectedValue(new Error('Database unique constraint failed'));
            
            await expect(landingImageService.addLandingImage('bad-uuid'))
                .rejects.toThrow('Database unique constraint failed');
        });
    });

    describe('getAllLandingImages', () => {
        it('should retrieve all landing images with their associated data', async () => {
            const mockList = [mockLandingImage, { ...mockLandingImage, id: 'landing-uuid-2' }];
            landingImageRepo.findAll.mockResolvedValue(mockList);

            const result = await landingImageService.getAllLandingImages();

            expect(landingImageRepo.findAll).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0].image.image_data).toBe('base64-data-string');
        });

        it('should return an empty array if no images exist', async () => {
            landingImageRepo.findAll.mockResolvedValue([]);
            const result = await landingImageService.getAllLandingImages();
            expect(result).toEqual([]);
        });
    });

    describe('removeLandingImage', () => {
        it('should return true when deletion is successful', async () => {
            landingImageRepo.deleteImage.mockResolvedValue(true);

            const result = await landingImageService.removeLandingImage('landing-uuid-1');

            expect(landingImageRepo.deleteImage).toHaveBeenCalledWith('landing-uuid-1');
            expect(result).toBe(true);
        });

        it('should return false if the image does not exist', async () => {
            landingImageRepo.deleteImage.mockResolvedValue(false);

            const result = await landingImageService.removeLandingImage('non-existent-id');

            expect(result).toBe(false);
            expect(landingImageRepo.deleteImage).toHaveBeenCalledWith('non-existent-id');
        });

        it('should propagate errors during deletion', async () => {
            landingImageRepo.deleteImage.mockRejectedValue(new Error('Foreign key constraint error'));
            
            await expect(landingImageService.removeLandingImage('landing-uuid-1'))
                .rejects.toThrow('Foreign key constraint error');
        });
    });
});