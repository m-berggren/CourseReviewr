import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/user.js';


const router = Router();

// User .env to store JWT secret
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Use passport local strategy to find username and compare hashed password using bcrypt
passport.use(new LocalStrategy(async function verify(username, inputPassword, done){
    try {
        const user = await User.findOne({username});
        if (!user) {
            return done(null, false, {message: 'Incorrect username'});
        }
        const passwordMatches = await bcrypt.compare(inputPassword, user.password);
        if (!passwordMatches) {
            return done(null, false, {message:'Incorrect password'});
        }
        return done(null, user);
    } catch(err) {
        return done(err);
    }
}));



//jwt generation after login successfully
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err){
            return next(err);
        }
        if (!user) {
            return res.status(401).json({message: info.message || 'Invalid credentials'});
        }
        const token = jwt.sign(
            {id: user.id, username: user.username},
            jwtSecret,
            {expiresIn: ' 8h'}
        );
        return res.status(200).json({message: 'Login successful', token});
    } ) (req. res. next);
});

//JWT middleware to protect routes
export const authenticateJWT = (req, res, next) => {
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


router.post('/register', async (req, res, next)=> {
    try {
        const {username, password: inputPassword} = req.body;

        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(409).json({message: 'User already exists'});
        }

        const saltRounds = 10;
        const password = await bcrypt.hash(inputPassword, saltRounds);

        const newUser = new User({
            username,
            password,
            role:'user'
        });
        await newUser.save();
        return res.status(201).json({message: ' User registerd successfully'});
    } catch(error) {
        next(error);
    }
});

export const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({message: 'Access denied: Admins only'});
    }next();
};

export default router;
