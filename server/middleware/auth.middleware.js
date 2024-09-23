import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// User .env to store JWT secret
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

//JWT middleware to protect routes
export const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, jwtSecret, (err, user)=> {
            if (err) {
                return res.status(403).json({message: 'Invalid or expired token'});
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({message: 'Token required'});
    }
};

// Middleware to check if the user has admin privilages
export const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({message: 'Access denied: Admins only'});
    }
    next();
};

export const generateToken = (user) => {
    return jwt.sign(
        {id: user._id, username: user.username, role: user.role},
        jwtSecret,
        {expiresIn: '8h'}
    );
};