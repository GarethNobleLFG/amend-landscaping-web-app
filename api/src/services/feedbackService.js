const feedbackRepo = require('../repositories/feedbackRepository');

const createFeedback = async (feedbackData) => {
    return await feedbackRepo.create(feedbackData);
};

const getAllFeedback = async () => {
    return await feedbackRepo.findAll();
};

const deleteFeedback = async (id) => {
    return await feedbackRepo.deleteFeedback(id);
};

module.exports = {
    createFeedback,
    getAllFeedback,
    deleteFeedback
};