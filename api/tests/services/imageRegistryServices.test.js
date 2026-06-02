const imageRegistryService = require('../../src/services/imageRegistryService');
const imageRegistryRepo = require('../../src/repositories/imageRegistryRepository');

jest.mock('../../src/repositories/imageRegistryRepository');

describe('Image Registry Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should upload image data to the registry', async () => {
        const mockImage = { id: 'uuid-1', image_data: 'base64-data' };
        imageRegistryRepo.create.mockResolvedValue(mockImage);

        const result = await imageRegistryService.uploadImage('base64-data');

        // Repository expects the raw string
        expect(imageRegistryRepo.create).toHaveBeenCalledWith('base64-data');
        // Service returns wrapped result
        expect(result).toEqual({ success: true, data: mockImage });
    });

    it('should fetch all images in the registry', async () => {
        const mockImages = [{ id: 'uuid-1', image_data: 'data' }];
        imageRegistryRepo.findAll.mockResolvedValue(mockImages);

        const result = await imageRegistryService.getAllImages();

        expect(imageRegistryRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockImages);
    });

    it('should delete images from the registry', async () => {
        imageRegistryRepo.deleteImage.mockResolvedValue(true);

        const result = await imageRegistryService.deleteImage('uuid-1');

        expect(imageRegistryRepo.deleteImage).toHaveBeenCalledWith('uuid-1');
        expect(result).toBe(true);
    });
});