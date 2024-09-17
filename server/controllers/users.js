import express from 'express';
import User from '../models/user.js';

const router = express.Router();

const handleError = (error, res) => {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'User already exists.' });
    } else if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages });
    }
};

router.post('/', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.status(201).json({ 'User': user });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({ users });

    } catch (error) {
        next (error);
    }
});

router.get('/:userID', async (req, res, next) => {
    try {
        const { userID } = req.params;
        const user = await User.findOne({ userID });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
});

router.put('/:userID', async (req, res, next) => {
    try {
        const { userID } = req.params;
        const updates = req.body;
        const updatedUser = await User.findOneAndUpdate({ userID }, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.patch('/:userID', async (req, res, next) => {
    try {
        const { userID } = req.params;
        const updates = req.body;
        const updatedUser = await User.findOneAndUpdate({ userID }, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.'});
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.delete('/:userID', async (req, res, next) => {
    try {
        const { userID } = req.params;
        const deletedUser = await User.findOneAndDelete({ userID });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.'});
        }

        res.status(200).json(deletedUser);

    } catch (error) {
        next(error);
    }
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ message: 'Internal Server Error.' });
});

export default router;