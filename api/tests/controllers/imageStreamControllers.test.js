const request = require('supertest');
const express = require('express');
const imageRegistryRoutes = require('../../src/routes/imageRegistryRoutes');
const imageStreamService = require('../../src/services/imageStreamService');

jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => next(),
    requireAdmin: (req, res, next) => next()
}));

jest.mock('../../src/services/imageStreamService');

describe('Image Stream Controller (via Routes)', () => {
    let app;
    let consoleWarnSpy;
    let consoleErrorSpy;

    beforeAll(() => {
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        consoleWarnSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/images', imageRegistryRoutes);
    });

    it('GET /images/stream/:id - 200 streams binary data with correct headers', async () => {
        const mockBinaryData = {
            buffer: Buffer.from('test-image-binary-payload'),
            contentType: 'image/webp'
        };
        imageStreamService.getImageRaw.mockResolvedValue(mockBinaryData);

        const res = await request(app).get('/images/stream/uuid-1');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toBe('image/webp');
        expect(res.headers['content-length']).toBe(String(mockBinaryData.buffer.length));
        expect(res.headers['cache-control']).toBe('public, max-age=31536000, immutable');
        expect(res.body.toString()).toBe('test-image-binary-payload');
    });

    it('GET /images/stream/:id - 404 if service returns null', async () => {
        imageStreamService.getImageRaw.mockResolvedValue(null);

        const res = await request(app).get('/images/stream/missing-uuid');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({});
        expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('GET /images/stream/:id - 500 on internal service fatal error', async () => {
        imageStreamService.getImageRaw.mockRejectedValue(new Error('Database dead connection'));

        const res = await request(app).get('/images/stream/uuid-error');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({});
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});