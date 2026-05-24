const userService = require('../../src/services/userServices');
const userRepository = require('../../src/repositories/userRepositories');
const jwt = require('jsonwebtoken');

jest.mock('../../src/repositories/userRepositories');

jest.mock('jsonwebtoken');

describe('User Authentication Business Logic (Service)', () => {
    let mockDbUser;

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, 'error').mockImplementation(() => {});

        mockDbUser = {
            id: 101,
            username: 'admin',
            password: 'correct_password',
            admin: true
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Login Process', () => {
        it('should successfully authenticate and return a signed JWT token if credentials are valid', async () => {
            userRepository.getUserByUsername.mockResolvedValue(mockDbUser);
            jwt.sign.mockReturnValue('mocked-signed-jwt');

            const result = await userService.loginUser('admin', 'correct_password');

            expect(userRepository.getUserByUsername).toHaveBeenCalledWith('admin');

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 101, username: 'admin', admin: true },
                expect.any(String), // Matches the secret fallback
                { expiresIn: '24h' }
            );

            expect(result.success).toBe(true);
            expect(result.token).toBe('mocked-signed-jwt');
            expect(result.user).toEqual({ id: 101, username: 'admin', admin: true });
        });

        it('should reject login if the username does not exist in the database', async () => {
            userRepository.getUserByUsername.mockResolvedValue(null);

            const result = await userService.loginUser('unknown_user', 'password');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid username or password');
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should reject login if the password does not match the database record', async () => {
            userRepository.getUserByUsername.mockResolvedValue(mockDbUser);

            const result = await userService.loginUser('admin', 'wrong_password');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid username or password');
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should propagate errors correctly if the database fails', async () => {
            const dbError = new Error('Database disconnected');
            userRepository.getUserByUsername.mockRejectedValue(dbError);

            await expect(userService.loginUser('admin', 'correct_password'))
                .rejects
                .toThrow('Database disconnected');
        });
    });
}); 