/* api/tests/services/imageStreamServices.test.js */

const imageStreamService = require('../../src/services/imageStreamService');
const imageRegistryRepo = require('../../src/repositories/imageRegistryRepository');

jest.mock('../../src/repositories/imageRegistryRepository');

describe('Image Stream Service', () => {
    let consoleErrorSpy;

    beforeAll(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a buffer and content type for a clean base64 image', async () => {
        const mockImage = { id: 'uuid-1', image_data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' };
        imageRegistryRepo.findById.mockResolvedValue(mockImage);

        const result = await imageStreamService.getImageRaw('uuid-1');

        expect(imageRegistryRepo.findById).toHaveBeenCalledWith('uuid-1');
        expect(result).not.toBeNull();
        expect(result.contentType).toBe('image/jpeg');
        expect(result.buffer).toBeInstanceOf(Buffer);
        expect(result.buffer.length).toBeGreaterThan(0);
    });

    it('should strip data url metadata and resolve content-type dynamically', async () => {
        const mockImage = { 
            id: 'uuid-2', 
            image_data: 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TCEAAAAvAAAAEP8HIYAA' 
        };
        imageRegistryRepo.findById.mockResolvedValue(mockImage);

        const result = await imageStreamService.getImageRaw('uuid-2');

        expect(result).not.toBeNull();
        expect(result.contentType).toBe('image/webp');
        expect(result.buffer).toBeInstanceOf(Buffer);
    });

    it('should return null if the image does not exist', async () => {
        imageRegistryRepo.findById.mockResolvedValue(null);

        const result = await imageStreamService.getImageRaw('missing-uuid');

        expect(result).toBeNull();
        // Verifies console.error was captured and silenced
        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should return null if image_data is missing', async () => {
        const mockImage = { id: 'uuid-3', image_data: null };
        imageRegistryRepo.findById.mockResolvedValue(mockImage);

        const result = await imageStreamService.getImageRaw('uuid-3');

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});