const request = require('supertest');
const express = require('express');
const imageRegistryRoutes = require('../../src/routes/imageRegistryRoutes');
const imageRegistryService = require('../../src/services/imageRegistryService');

jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => next(),
    requireAdmin: (req, res, next) => next()
}));

jest.mock('../../src/services/imageRegistryService');

describe('Image Registry Controller', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json({ limit: '10mb' }));
        app.use('/images', imageRegistryRoutes);
    });

    it('GET /images - 200 list of registry items', async () => {
        const mockImages = [{ id: '1', image_data: 'data' }];
        imageRegistryService.getAllImages.mockResolvedValue(mockImages);

        const res = await request(app).get('/images');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockImages);
    });

    it('POST /images - 201 uploaded', async () => {
        const mockImage = { id: '1', image_data: 'base64-string' };
        imageRegistryService.uploadImage.mockResolvedValue({ success: true, data: mockImage });

        const res = await request(app)
            .post('/images')
            .send({ image_data: 'base64-string' });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockImage);
    });

    it('DELETE /images/:id - 204 deleted', async () => {
        imageRegistryService.deleteImage.mockResolvedValue(true);

        const res = await request(app).delete('/images/1');

        expect(res.status).toBe(204);
    });
});