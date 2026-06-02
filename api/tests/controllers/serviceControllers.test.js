const request = require('supertest');
const express = require('express');
const serviceRoutes = require('../../src/routes/serviceRoutes');
const serviceService = require('../../src/services/serviceService');

// Mock auth middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => next(),
    requireAdmin: (req, res, next) => next()
}));

// Mock the Service service layer
jest.mock('../../src/services/serviceService');

describe('Service Controller', () => {
    let app;
    let mockService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });

        app = express();
        app.use(express.json());
        app.use('/services', serviceRoutes);

        mockService = {
            id: 1,
            name: 'Lawn Mowing',
            description: 'Lawn mowing and edging service',
            is_available: true,
            image_id: 'uuid-123',
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('GET /services', () => {
        it('should return 200 and available services', async () => {
            serviceService.getAvailableServices.mockResolvedValue([mockService]);

            const res = await request(app).get('/services');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].name).toBe('Lawn Mowing');
        });
    });

    describe('GET /services/all', () => {
        it('should return 200 and all services (admin)', async () => {
            serviceService.getAllServices.mockResolvedValue([mockService]);

            const res = await request(app).get('/services/all');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('POST /services', () => {
        it('should return 201 and the new service when creation is successful', async () => {
            serviceService.createService.mockResolvedValue(mockService);

            const res = await request(app)
                .post('/services')
                .send({ 
                    name: 'Lawn Mowing', 
                    description: 'Lawn mowing and edging service', 
                    is_available: true, 
                    image_id: 'uuid-123' 
                });

            expect(res.status).toBe(201);
            expect(res.body.image_id).toBe('uuid-123');
        });

        it('should return 400 if service creation throws an error', async () => {
            serviceService.createService.mockRejectedValue(new Error('Validation failed'));

            const res = await request(app)
                .post('/services')
                .send({ description: 'No name' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation failed');
        });
    });

    describe('DELETE /services/:id', () => {
        it('should return 204 on successful deletion', async () => {
            serviceService.deleteService.mockResolvedValue(true);

            const res = await request(app).delete('/services/1');

            expect(res.status).toBe(204);
        });

        it('should return 404 if service to delete is not found', async () => {
            serviceService.deleteService.mockResolvedValue(false);

            const res = await request(app).delete('/services/999');

            expect(res.status).toBe(404);
        });
    });
});