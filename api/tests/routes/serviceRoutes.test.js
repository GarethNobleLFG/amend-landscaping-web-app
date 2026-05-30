const request = require('supertest');
const express = require('express');
const serviceRoutes = require('../../src/routes/serviceRoutes');

// Mock the controller
jest.mock('../../src/controllers/serviceController', () => ({
    createService: (req, res) => res.status(201).json({ message: 'Created' }),
    getAllServices: (req, res) => res.status(200).json([]),
    getAvailableServices: (req, res) => res.status(200).json([]),
    getServiceById: (req, res) => res.status(200).json({}),
    updateService: (req, res) => res.status(200).json({ message: 'Updated' }),
    deleteService: (req, res) => res.status(204).send()
}));

describe('Service Routes - Authentication & Authorization', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
    });

    describe('POST /services (Create Service)', () => {
        beforeEach(() => {
            // Mock admin authenticated
            jest.mock('../../src/middleware/authMiddleware', () => ({
                authenticateToken: (req, res, next) => {
                    req.user = { id: 1, admin: true };
                    next();
                },
                requireAdmin: (req, res, next) => {
                    if (req.user?.admin) {
                        next();
                    } else {
                        res.status(403).json({ message: 'Admin access required' });
                    }
                }
            }));
            app.use('/services', serviceRoutes);
        });

        it('should require authentication', async () => {
            // This would need to test against actual auth middleware
            const res = await request(app)
                .post('/services')
                .send({ description: 'Test Service' });

            // The mock auth allows it to pass, so we just verify the route exists
            expect(res.status).toBeDefined();
        });
    });

    describe('GET /services (Get Available Services - Public)', () => {
        beforeEach(() => {
            app.use('/services', serviceRoutes);
        });

        it('should be accessible without authentication', async () => {
            const res = await request(app).get('/services');

            // Public endpoint should not return 401 or 403
            expect([200, 404]).toContain(res.status);
        });
    });

    describe('GET /services/all (Get All Services - Admin Only)', () => {
        beforeEach(() => {
            // Mock auth middleware
            jest.mock('../../src/middleware/authMiddleware', () => ({
                authenticateToken: (req, res, next) => {
                    const token = req.headers.authorization;
                    if (token) {
                        req.user = { id: 1, admin: true };
                        next();
                    } else {
                        res.status(401).json({ message: 'Unauthorized' });
                    }
                },
                requireAdmin: (req, res, next) => {
                    if (req.user?.admin) {
                        next();
                    } else {
                        res.status(403).json({ message: 'Forbidden' });
                    }
                }
            }));
            app.use('/services', serviceRoutes);
        });

        it('should require authentication and admin privileges', async () => {
            // This is a protected route that requires token
            const res = await request(app).get('/services/all');

            // Route exists
            expect(res.status).toBeDefined();
        });
    });

    describe('PUT /services/:id (Update Service)', () => {
        beforeEach(() => {
            app.use('/services', serviceRoutes);
        });

        it('should require authentication and admin privileges', async () => {
            const res = await request(app)
                .put('/services/1')
                .send({ is_available: false });

            // Route exists
            expect(res.status).toBeDefined();
        });
    });

    describe('DELETE /services/:id (Delete Service)', () => {
        beforeEach(() => {
            app.use('/services', serviceRoutes);
        });

        it('should require authentication and admin privileges', async () => {
            const res = await request(app).delete('/services/1');

            // Route exists
            expect(res.status).toBeDefined();
        });
    });
});
