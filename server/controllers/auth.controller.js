import User from '../models/user.model.js';
import { generateToken } from '../utils/token.util.js';
import { hashPassword } from '../utils/password.util.js';


//JWT generation after login successfully
const login =  (req, res) => {
    const token = generateToken(req.user);
    return res.status(200).json({message: 'Login successful', token});
};

const register = async (req, res, next)=> {
    try {
        const { username, password: inputPassword, email } = req.body;

        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(409).json({message: 'User already exists'});
        }

        const password = await hashPassword(inputPassword);

        const newUser = new User({
            username,
            password,
            email,
            role:'user'
        });
        await newUser.save();
        return res.status(201).json({ userID: newUser._id, message: 'User registerd successfully' });
    } catch(error) {
        next(error);
    }
};

const authController = {
    register,
    login
};

export default authController;