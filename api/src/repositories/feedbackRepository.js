const Feedback = require('../models/feedback');

const create = async (feedbackData) => {
    return await Feedback.create(feedbackData);
};

const findAll = async () => {
    return await Feedback.findAll({
        order: [['createdAt', 'DESC']]
    });
};

const deleteFeedback = async (id) => {
    const feedback = await Feedback.findByPk(id);

    if (!feedback) {
        return false;
    }

    await feedback.destroy();
    return true;
};

module.exports = {
    create,
    findAll,
    deleteFeedback
};