const request = require('supertest');
const express = require('express');
const landingImageRoutes = require('../../src/routes/landingImageRoutes');
const landingImageService = require('../../src/services/landingImageService');

jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => next()
}));

jest.mock('../../src/services/landingImageService');

describe('Landing Image Controller', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/landing-images', landingImageRoutes);
    });

    it('GET /landing-images - 200 list of images', async () => {
        const mockImages = [{ id: '1', image: { image_data: 'data' } }];
        landingImageService.getAllLandingImages.mockResolvedValue(mockImages);

        const res = await request(app).get('/landing-images');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockImages);
    });

    it('POST /landing-images - 201 created', async () => {
        const mockImage = { id: '1', image_id: 'img-1' };
        landingImageService.addLandingImage.mockResolvedValue(mockImage);

        const res = await request(app)
            .post('/landing-images')
            .send({ image_id: 'img-1' });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockImage);
    });

    it('DELETE /landing-images/:id - 204 no content', async () => {
        landingImageService.removeLandingImage.mockResolvedValue(true);

        const res = await request(app).delete('/landing-images/1');

        expect(res.status).toBe(204);
    });
});