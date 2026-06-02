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
            image: 'base64image',
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Creating a New Service', () => {
        it('should return 201 and the new service when creation is successful', async () => {
            serviceService.createService.mockResolvedValue({ success: true, data: mockService });

            const res = await request(app)
                .post('/services')
                .send({ name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true, image: 'base64image' });

            expect(serviceService.createService).toHaveBeenCalledWith('Lawn Mowing', 'Lawn mowing and edging service', true, 'base64image');
            expect(res.status).toBe(201);
            expect(res.body.id).toBe(1);
            expect(res.body.name).toBe('Lawn Mowing');
            expect(res.body.description).toBe('Lawn mowing and edging service');
            expect(res.body.image).toBe('base64image');
        });


        it('should create a service with is_available defaulting to true and image to blank', async () => {
            serviceService.createService.mockResolvedValue({ success: true, data: { ...mockService, image: undefined } });

            const res = await request(app)
                .post('/services')
                .send({ name: 'Tree Trimming', description: 'Tree trimming and removal service' });

            expect(serviceService.createService).toHaveBeenCalledWith('Tree Trimming', 'Tree trimming and removal service', true, undefined);
            expect(res.status).toBe(201);
        });

        it('should return 400 if the service creation fails due to validation error', async () => {
            serviceService.createService.mockRejectedValue(new Error('Name and description are required'));

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
                { id: 1, name: 'Lawn Mowing', description: 'Lawn mowing and edging service', is_available: true, image: 'img1' },
                { id: 2, name: 'Tree Trimming', description: 'Tree trimming and removal service', is_available: false, image: null }
            ];
            serviceService.getAllServices.mockResolvedValue(allServices);

            const res = await request(app).get('/services/all');

            expect(serviceService.getAllServices).toHaveBeenCalledWith();
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[1].is_available).toBe(false);
        });

        it('should return empty array when no services exist', async () => {
            serviceService.getAllServices.mockResolvedValue([]);

            const res = await request(app).get('/services/all');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('should return 500 if the service throws an error when fetching all services', async () => {
            serviceService.getAllServices.mockRejectedValue(new Error('Database Error'));

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
            serviceService.getAvailableServices.mockResolvedValue(availableServices);

            const res = await request(app).get('/services');

            expect(serviceService.getAvailableServices).toHaveBeenCalledWith();
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body.every(s => s.is_available)).toBe(true);
        });

        it('should return empty array when no available services exist', async () => {
            serviceService.getAvailableServices.mockResolvedValue([]);

            const res = await request(app).get('/services');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('should return 500 if the service throws an error', async () => {
            serviceService.getAvailableServices.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/services');

            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('Getting a Specific Service by ID', () => {
        it('should return 200 and the service when found', async () => {
            serviceService.getServiceById.mockResolvedValue(mockService);

            const res = await request(app).get('/services/1');

            expect(serviceService.getServiceById).toHaveBeenCalledWith('1');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.name).toBe('Lawn Mowing');
        });

        it('should return 404 when the service does not exist', async () => {
            serviceService.getServiceById.mockResolvedValue(null);

            const res = await request(app).get('/services/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Service not found');
        });

        it('should return 500 if the service throws an error', async () => {
            serviceService.getServiceById.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/services/1');

            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('Updating a Service', () => {
        it('should return 200 and the updated service when update is successful', async () => {
            const updatedService = { ...mockService, name: 'Updated Lawn Mowing', is_available: false, image: 'img2' };
            serviceService.updateService.mockResolvedValue(updatedService);

            const res = await request(app)
                .put('/services/1')
                .send({ name: 'Updated Lawn Mowing', description: 'Updated description', is_available: false, image: 'img2' });

            expect(serviceService.updateService).toHaveBeenCalledWith('1', 'Updated Lawn Mowing', 'Updated description', false, 'img2');
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated Lawn Mowing');
            expect(res.body.is_available).toBe(false);
            expect(res.body.image).toBe('img2');
        });

        it('should successfully parse and save a service update containing a base64 custom image payload', async () => {
            const imagePayload = 'data:image/webp;base64,WebpBinaryPayloadGoesHere';
            const updatedService = { ...mockService, image: imagePayload };
            serviceService.updateService.mockResolvedValue(updatedService);

            const res = await request(app)
                .put('/services/1')
                .send({
                    name: 'Hardscaping Design',
                    description: 'Full custom build-outs',
                    is_available: true,
                    image: imagePayload
                });

            expect(serviceService.updateService).toHaveBeenCalledWith(
                '1',
                'Hardscaping Design',
                'Full custom build-outs',
                true,
                imagePayload
            );
            expect(res.status).toBe(200);
            expect(res.body.image).toBe(imagePayload);
        });

        it('should return 404 if the service to update does not exist', async () => {
            serviceService.updateService.mockResolvedValue(null);

            const res = await request(app)
                .put('/services/999')
                .send({ name: 'Updated Service', description: 'Updated description' });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Service not found');
        });

        it('should return 400 if the service update fails due to validation error', async () => {
            serviceService.updateService.mockRejectedValue(new Error('Validation failed'));

            const res = await request(app)
                .put('/services/1')
                .send({ name: '', description: '' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('Deleting a Service', () => {
        it('should return 204 when service is deleted successfully', async () => {
            serviceService.deleteService.mockResolvedValue(true);

            const res = await request(app).delete('/services/1');

            expect(serviceService.deleteService).toHaveBeenCalledWith('1');
            expect(res.status).toBe(204);
        });

        it('should return 404 if the service to delete does not exist', async () => {
            serviceService.deleteService.mockResolvedValue(false);

            const res = await request(app).delete('/services/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Service not found');
        });

        it('should return 500 if the delete operation throws an error', async () => {
            serviceService.deleteService.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).delete('/services/1');

            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
        });
    });
});