const userService = require('../services/userServices');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const result = await userService.loginUser(username, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        return res.status(200).json({
            message: 'Login successful',
            user: result.user,
            token: result.token
        });
    } 
    catch (error) {
        console.error('Login controller error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    login
};