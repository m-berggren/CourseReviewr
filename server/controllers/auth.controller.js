import User from '../models/user.model.js';
import { generateToken } from '../utils/token.util.js';
import { hashPassword } from '../utils/password.util.js';


//JWT generation after signin successfully
const signin =  (req, res) => {
    const token = generateToken(req.user);
    return res.status(200).json({message: 'Sign in successful', token});
};

const register = async (req, res, next)=> {
    try {
        const { username, password: inputPassword, email } = req.body;

        // Check if username or email already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });

        if (existingUser) {
            return res.status(409).json({ 
                message: existingUser.username === username 
                    ? 'Username already exists' 
                    : 'Email already exists' 
            });
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
    signin
};

export default authController;