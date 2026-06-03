const userRepository = require('../repositories/userRepositories');
const jwt = require('jsonwebtoken');

const loginUser = async (username, password) => {
    try {
        const user = await userRepository.getUserByUsername(username);
        
        if (!user) {
            return { success: false, message: 'Invalid username or password' };
        }

        const isMatch = (password === user.password); 

        if (!isMatch) {
            return { success: false, message: 'Invalid username or password' };
        }

        const payload = {
            id: user.id,
            username: user.username,
            admin: user.admin
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'super_secret_fallback_key', 
            { expiresIn: '24h' }
        );

        return {
            success: true,
            token: token,
            user: payload
        };
    } 
    catch (error) {
        console.error('Error during login process:', error);
        throw error;
    }
};

module.exports = {
    loginUser
};