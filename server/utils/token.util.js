import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// User .env to store JWT secret
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        jwtSecret,
        { expiresIn: '1h' }
    );
};