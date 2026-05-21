const User = require('../models/users');

const getUserById = async (id) => {
    try {
        return await User.findByPk(id);
    } 
    catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

const getUserByUsername = async (username) => {
    try {
        return await User.findOne({ where: { username } });
    } 
    catch (error) {
        console.error('Error fetching user by username:', error);
        throw error;
    }
};

module.exports = {
    getUserById,
    getUserByUsername
};