const feedbackService = require('../../src/services/feedbackService');
const feedbackRepo = require('../../src/repositories/feedbackRepository');

jest.mock('../../src/repositories/feedbackRepository');

describe('Feedback Business Logic (Service Layer)', () => {
    let mockFeedback;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });

        mockFeedback = {
            id: 'uuid-123',
            email: 'test@example.com',
            message: 'Great service!',
            createdAt: new Date()
        };
    });

    describe('createFeedback', () => {
        it('should successfully create feedback', async () => {
            feedbackRepo.create.mockResolvedValue(mockFeedback);

            const result = await feedbackService.createFeedback({
                email: 'test@example.com',
                message: 'Great service!'
            });

            expect(result).toEqual(mockFeedback);
            expect(feedbackRepo.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                message: 'Great service!'
            });
        });

        it('should propagate repository errors', async () => {
            feedbackRepo.create.mockRejectedValue(new Error('DB Error'));

            await expect(
                feedbackService.createFeedback({
                    email: 'test@example.com',
                    message: 'Great service!'
                })
            ).rejects.toThrow('DB Error');
        });
    });

    describe('getAllFeedback', () => {
        it('should return all feedback entries', async () => {
            feedbackRepo.findAll.mockResolvedValue([mockFeedback]);

            const result = await feedbackService.getAllFeedback();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockFeedback);
            expect(feedbackRepo.findAll).toHaveBeenCalled();
        });

        it('should return empty array when no feedback exists', async () => {
            feedbackRepo.findAll.mockResolvedValue([]);

            const result = await feedbackService.getAllFeedback();

            expect(result).toEqual([]);
        });
    });

    describe('deleteFeedback', () => {
        it('should return true when feedback is deleted successfully', async () => {
            feedbackRepo.deleteFeedback.mockResolvedValue(true);

            const result = await feedbackService.deleteFeedback('uuid-123');

            expect(result).toBe(true);
            expect(feedbackRepo.deleteFeedback).toHaveBeenCalledWith('uuid-123');
        });

        it('should return false when feedback does not exist', async () => {
            feedbackRepo.deleteFeedback.mockResolvedValue(false);

            const result = await feedbackService.deleteFeedback('non-existent-id');

            expect(result).toBe(false);
        });

        it('should propagate deletion errors', async () => {
            feedbackRepo.deleteFeedback.mockRejectedValue(new Error('Delete failed'));

            await expect(
                feedbackService.deleteFeedback('uuid-123')
            ).rejects.toThrow('Delete failed');
        });
    });
});