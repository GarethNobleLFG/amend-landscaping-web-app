const request = require('supertest');
const express = require('express');
const feedbackRoutes = require('../../src/routes/feedbackRoutes');
const feedbackService = require('../../src/services/feedbackService');

// Mock auth middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => next(),
    requireAdmin: (req, res, next) => next()
}));

// Mock service layer
jest.mock('../../src/services/feedbackService');

describe('Feedback Controller Logic', () => {
    let app;
    let mockFeedback;

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, 'error').mockImplementation(() => {});

        app = express();
        app.use(express.json());
        app.use('/feedback', feedbackRoutes);

        mockFeedback = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'test@example.com',
            message: 'Great service!'
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Submitting Feedback', () => {
        it('should return 201 and the created feedback when submission is successful', async () => {
            feedbackService.createFeedback.mockResolvedValue(mockFeedback);

            const res = await request(app)
                .post('/feedback')
                .send({
                    email: 'test@example.com',
                    message: 'Great service!'
                });

            expect(feedbackService.createFeedback).toHaveBeenCalledWith({
                email: 'test@example.com',
                message: 'Great service!'
            });

            expect(res.status).toBe(201);
            expect(res.body.id).toBe(mockFeedback.id);
        });

        it('should return 500 if the service throws an error during submission', async () => {
            feedbackService.createFeedback.mockRejectedValue(
                new Error('Database Error')
            );

            const res = await request(app)
                .post('/feedback')
                .send({
                    email: 'test@example.com',
                    message: 'Great service!'
                });

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to create feedback');
        });
    });

    describe('Viewing Feedback Submissions', () => {
        it('should return 200 and all feedback entries', async () => {
            feedbackService.getAllFeedback.mockResolvedValue([mockFeedback]);

            const res = await request(app).get('/feedback');

            expect(feedbackService.getAllFeedback).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].id).toBe(mockFeedback.id);
        });

        it('should return 500 if the service throws an error while fetching feedback', async () => {
            feedbackService.getAllFeedback.mockRejectedValue(
                new Error('Database Error')
            );

            const res = await request(app).get('/feedback');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to fetch feedback');
        });
    });

    describe('Deleting Feedback', () => {
        it('should return 200 when feedback is successfully deleted', async () => {
            feedbackService.deleteFeedback.mockResolvedValue(true);

            const res = await request(app)
                .delete(`/feedback/${mockFeedback.id}`);

            expect(feedbackService.deleteFeedback)
                .toHaveBeenCalledWith(mockFeedback.id);

            expect(res.status).toBe(200);
            expect(res.body.message)
                .toBe('Feedback deleted successfully');
        });

        it('should return 404 when feedback does not exist', async () => {
            feedbackService.deleteFeedback.mockResolvedValue(false);

            const res = await request(app)
                .delete('/feedback/non-existent-id');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Feedback not found');
        });

        it('should return 500 if the service throws an error during deletion', async () => {
            feedbackService.deleteFeedback.mockRejectedValue(
                new Error('Delete Error')
            );

            const res = await request(app)
                .delete(`/feedback/${mockFeedback.id}`);

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to delete feedback');
        });
    });
});