const request = require('supertest');
const express = require('express');
const userRoutes = require('../../src/routes/userRoutes');
const userService = require('../../src/services/userServices');

jest.mock('../../src/services/userServices');

describe('User Authentication Controller Logic', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, 'error').mockImplementation(() => { });

        app = express();
        app.use(express.json());
        app.use('/users', userRoutes);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('User Login Process', () => {
        it('should return 200 and a token when credentials are valid', async () => {
            userService.loginUser.mockResolvedValue({
                success: true,
                user: { id: 1, username: 'admin' },
                token: 'mock-jwt-token-123'
            });

            const res = await request(app)
                .post('/users/login')
                .send({ username: 'admin', password: 'password123' });

            expect(userService.loginUser).toHaveBeenCalledWith('admin', 'password123');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Login successful');
            expect(res.body.token).toBe('mock-jwt-token-123');
        });

        it('should return 400 closely matching "bad request" if username or password is omitted', async () => {
            const res = await request(app)
                .post('/users/login')
                .send({ username: 'admin' }); // Missing password

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Username and password are required');
            // The service shouldn't even be called
            expect(userService.loginUser).not.toHaveBeenCalled();
        });

        it('should return 401 Unauthorized if the credentials fail service verification', async () => {
            userService.loginUser.mockResolvedValue({
                success: false,
                message: 'Invalid credentials'
            });

            const res = await request(app)
                .post('/users/login')
                .send({ username: 'admin', password: 'wrongpassword' });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid credentials');
        });

        it('should return 500 if the service layer crashes', async () => {
            userService.loginUser.mockRejectedValue(new Error('Database disconnected'));

            const res = await request(app)
                .post('/users/login')
                .send({ username: 'admin', password: 'password123' });

            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Internal server error');
        });
    });
});