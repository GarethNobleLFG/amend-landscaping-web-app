const feedbackService = require('../services/feedbackService');

// POST /feedback
const create = async (req, res) => {
    try {
        const feedback = await feedbackService.createFeedback(req.body);

        res.status(201).json(feedback);
    }
    catch (error) {
        console.error('Error creating feedback:', error);
        res.status(500).json({ error: 'Failed to create feedback' });
    }
};

// GET /feedback
const getAll = async (req, res) => {
    try {
        const feedback = await feedbackService.getAllFeedback();

        res.status(200).json(feedback);
    }
    catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
};

// DELETE /feedback/:id
const deleteFeedback = async (req, res) => {
    try {
        const deleted = await feedbackService.deleteFeedback(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ error: 'Failed to delete feedback' });
    }
};

module.exports = {
    create,
    getAll,
    deleteFeedback
};