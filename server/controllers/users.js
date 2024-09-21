import express from 'express';
import User from '../models/user.js';

const router = express.Router();

const handleError = (error, res) => {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'User already exists.' });
    } else if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages });
    } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
};

router.post('/', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.status(201).json(user);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json(users);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).populate('courseLists').populate('recommendationList');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        // using spread operator (...) to update values
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {...updates},
            { new: true, runValidators: true, overwrite: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updates, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.'});
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.'});
        }

        res.status(200).json(deletedUser);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.use((err, req, res) => {
    console.error(err.stack);
    return res.status(500).json({ message: 'Internal Server Error.' });
});

export default router;