import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

// Use passport local strategy to find username and compare hashed password using bcrypt
export const configurePassport = () => {
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
};

export const authenticateUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err){
            return next(err);
        }
        if (!user) {       
            return res.status(401).json({message: info.message || 'Invalid credentials'});
        }

        // If user is authenticated, attach user to the request object
        req.user = user;
        next(); // Pass control to next middleware
    } ) (req, res, next);
};