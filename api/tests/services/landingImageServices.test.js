const landingImageService = require('../../src/services/landingImageService');
const landingImageRepo = require('../../src/repositories/landingImageRepository');

jest.mock('../../src/repositories/landingImageRepository');

describe('Landing Image Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a landing image successfully', async () => {
        const mockImage = { id: 'uuid-1', image_id: 'img-uuid' };
        landingImageRepo.create.mockResolvedValue(mockImage);

        const result = await landingImageService.addLandingImage('img-uuid');

        expect(landingImageRepo.create).toHaveBeenCalledWith({ image_id: 'img-uuid' });
        expect(result).toEqual(mockImage);
    });

    it('should retrieve all landing images', async () => {
        const mockImages = [{ id: 'uuid-1', image: { image_data: 'data' } }];
        landingImageRepo.findAll.mockResolvedValue(mockImages);

        const result = await landingImageService.getAllLandingImages();

        expect(landingImageRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockImages);
    });

    it('should remove a landing image', async () => {
        landingImageRepo.deleteImage.mockResolvedValue(true);

        const result = await landingImageService.removeLandingImage('uuid-1');

        expect(landingImageRepo.deleteImage).toHaveBeenCalledWith('uuid-1');
        expect(result).toBe(true);
    });
});