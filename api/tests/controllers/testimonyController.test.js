const request = require('supertest');
const express = require('express');
const testimonyRoutes = require('../../src/routes/testimonyRoutes');
const testimonyService = require('../../src/services/testimonyService');

// Mock auth middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => next(),
    requireAdmin: (req, res, next) => next()
}));

jest.mock('../../src/services/testimonyService');

describe('Testimony Controller', () => {
    let app;
    let mockTestimony;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/testimonies', testimonyRoutes);

        mockTestimony = {
            id: 'uuid-123',
            name: 'Jane Smith',
            quote: 'Top tier landscaping.',
            createdAt: new Date()
        };
    });

    describe('GET /testimonies', () => {
        it('should return 200 and all testimonies', async () => {
            testimonyService.getAllTestimonies.mockResolvedValue([mockTestimony]);

            const res = await request(app).get('/testimonies');

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toBe('Jane Smith');
        });
    });

    describe('POST /testimonies', () => {
        it('should return 201 when creation is successful', async () => {
            testimonyService.addTestimony.mockResolvedValue(mockTestimony);

            const res = await request(app)
                .post('/testimonies')
                .send({ name: 'Jane Smith', quote: 'Top tier landscaping.' });

            expect(res.status).toBe(201);
            expect(res.body.id).toBe('uuid-123');
        });

        it('should return 400 when validation fails', async () => {
            testimonyService.addTestimony.mockRejectedValue(new Error('Name and quote are required'));

            const res = await request(app)
                .post('/testimonies')
                .send({ name: '', quote: '' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Name and quote are required');
        });
    });

    describe('DELETE /testimonies/:id', () => {
        it('should return 204 on successful deletion', async () => {
            testimonyService.removeTestimony.mockResolvedValue(true);

            const res = await request(app).delete('/testimonies/uuid-123');

            expect(res.status).toBe(204);
        });

        it('should return 404 if testimony not found', async () => {
            testimonyService.removeTestimony.mockResolvedValue(false);

            const res = await request(app).delete('/testimonies/non-existent');

            expect(res.status).toBe(404);
        });
    });
});