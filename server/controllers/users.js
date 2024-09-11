const router = require('express').Router();
const User = require('../models/user');


router.post('/', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.json({ 'User': user });

    } catch (error) {
        next(error);
    }
})

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();

        res.json({ users });

    } catch (error) {
        next (error);
    }
})

router.get('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        res.json(user);

    } catch (error) {
        next(error);
    }
})

router.put('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        const updatedUser = await User.findOneAndUpdate({ userId }, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(updatedUser);

    } catch (error) {
        next(error);
    }
})

router.patch('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        const updatedUser = await User.findOneAndUpdate({ userId }, updates, {
            new: true,
            runValidator: true
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.'});
        }

        res.json(updatedUser);

    } catch (error) {
        next(error);
    }
})

router.delete('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findOneAndDelete({ userId });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.'});
        }

        res.json(deletedUser);

    } catch (error) {
        next(error);
    }
})