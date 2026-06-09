const imageRegistryService = require('../../src/services/imageRegistryService');
const imageRegistryRepo = require('../../src/repositories/imageRegistryRepository');
const { uploadToStorage } = require('../../src/services/storageService');

jest.mock('../../src/repositories/imageRegistryRepository');
jest.mock('../../src/services/storageService'); 

describe('Image Registry Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should upload image data to the registry', async () => {
        // 1. Mock valid Base64 and Return URL
        const mockBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
        const mockUrl = 'http://localhost:3001/uploads/test.png';
        const mockImage = { id: 'uuid-1', image_url: mockUrl };

        uploadToStorage.mockResolvedValue(mockUrl);
        imageRegistryRepo.create.mockResolvedValue(mockImage);

        // 2. Call the service
        const result = await imageRegistryService.uploadImage(mockBase64);

        // 3. Assertions
        expect(uploadToStorage).toHaveBeenCalledWith(mockBase64);
        expect(imageRegistryRepo.create).toHaveBeenCalledWith(mockUrl);
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