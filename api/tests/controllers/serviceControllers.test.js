const request = require('supertest');
const express = require('express');
const serviceRoutes = require('../../src/routes/serviceRoutes');
const Service = require('../../src/models/services');

// Mock auth middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => next(),
    requireAdmin: (req, res, next) => next()
}));

// Mock the Service model
jest.mock('../../src/models/services');

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
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Creating a New Service', () => {
        it('should return 201 and the new service when creation is successful', async () => {
            Service.create.mockResolvedValue(mockService);

            const res = await request(app)
                .post('/services')
                .send({ name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true });

            expect(Service.create).toHaveBeenCalledWith({ name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true });
            expect(res.status).toBe(201);
            expect(res.body.id).toBe(1);
            expect(res.body.name).toBe('Lawn Mowing');
            expect(res.body.description).toBe('Lawn mowing and edging service');
        });

        it('should create a service with is_available defaulting to true', async () => {
            Service.create.mockResolvedValue({ ...mockService, is_available: true });

            const res = await request(app)
                .post('/services')
                .send({ name: 'Tree Trimming', description: 'Tree trimming and removal service' });

            expect(Service.create).toHaveBeenCalledWith({ name: 'Tree Trimming', description: 'Tree trimming and removal service', is_available: true });
            expect(res.status).toBe(201);
        });

        it('should return 400 if the service creation fails due to validation error', async () => {
            Service.create.mockRejectedValue(new Error('Name and description are required'));

            const res = await request(app)
                .post('/services')
                .send({ name: '', description: '', is_available: true });

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('Getting All Services (Admin Only)', () => {
        it('should return 200 and a list of all services including unavailable ones', async () => {
            const allServices = [
                { id: 1, name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true },
                { id: 2, name: 'Tree Trimming', description: 'Tree trimming and removal service', is_available: false }
            ];
            Service.findAll.mockResolvedValue(allServices);

            const res = await request(app).get('/services/all');

            expect(Service.findAll).toHaveBeenCalledWith();
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[1].is_available).toBe(false);
        });

        it('should return empty array when no services exist', async () => {
            Service.findAll.mockResolvedValue([]);

            const res = await request(app).get('/services/all');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('should return 500 if the service throws an error when fetching all services', async () => {
            Service.findAll.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/services/all');

            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('Getting Available Services (Public)', () => {
        it('should return 200 and only available services', async () => {
            const availableServices = [
                { id: 1, name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true },
                { id: 3, name: 'Landscaping', description: 'Full landscaping design service', is_available: true }
            ];
            Service.findAll.mockResolvedValue(availableServices);

            const res = await request(app).get('/services');

            expect(Service.findAll).toHaveBeenCalledWith({ where: { is_available: true } });
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body.every(s => s.is_available)).toBe(true);
        });

        it('should return empty array when no available services exist', async () => {
            Service.findAll.mockResolvedValue([]);

            const res = await request(app).get('/services');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('should return 500 if the service throws an error', async () => {
            Service.findAll.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/services');

            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('Getting a Specific Service by ID', () => {
        it('should return 200 and the service when found', async () => {
            Service.findByPk.mockResolvedValue(mockService);

            const res = await request(app).get('/services/1');

            expect(Service.findByPk).toHaveBeenCalledWith('1');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.name).toBe('Lawn Mowing');
            expect(res.body.description).toBe('Lawn mowing and edging service');
        });

        it('should return 404 when the service does not exist', async () => {
            Service.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/services/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Service not found');
        });

        it('should return 500 if the service throws an error', async () => {
            Service.findByPk.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/services/1');

            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('Updating a Service', () => {
        it('should return 200 and the updated service when update is successful', async () => {
            const mockServiceInstance = { ...mockService };
            mockServiceInstance.update = jest.fn().mockImplementation(async (updates) => {
                Object.assign(mockServiceInstance, updates);
                return mockServiceInstance;
            });
            Service.findByPk.mockResolvedValue(mockServiceInstance);

            const res = await request(app)
                .put('/services/1')
                .send({ name: 'Updated Lawn Mowing', description: 'Updated description', is_available: false });

            expect(Service.findByPk).toHaveBeenCalledWith('1');
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated Lawn Mowing');
            expect(res.body.description).toBe('Updated description');
            expect(res.body.is_available).toBe(false);
        });

        it('should return 404 if the service to update does not exist', async () => {
            Service.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .put('/services/999')
                .send({ name: 'Updated Service', description: 'Updated description' });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Service not found');
        });

        it('should return 400 if the service update fails due to validation error', async () => {
            const mockServiceInstance = { ...mockService };
            mockServiceInstance.update = jest.fn().mockRejectedValue(new Error('Validation failed'));
            Service.findByPk.mockResolvedValue(mockServiceInstance);

            const res = await request(app)
                .put('/services/1')
                .send({ name: '', description: '' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('Deleting a Service', () => {
        it('should return 204 when service is deleted successfully', async () => {
            Service.findByPk.mockResolvedValue({
                ...mockService,
                destroy: jest.fn().mockResolvedValue()
            });

            const res = await request(app).delete('/services/1');

            expect(Service.findByPk).toHaveBeenCalledWith('1');
            expect(res.status).toBe(204);
        });

        it('should return 404 if the service to delete does not exist', async () => {
            Service.findByPk.mockResolvedValue(null);

            const res = await request(app).delete('/services/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Service not found');
        });

        it('should return 500 if the delete operation throws an error', async () => {
            Service.findByPk.mockResolvedValue({
                ...mockService,
                destroy: jest.fn().mockRejectedValue(new Error('Database Error'))
            });

            const res = await request(app).delete('/services/1');

            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
        });
    });
});