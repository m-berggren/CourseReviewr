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

router.get('/:userID', async (req, res, next) => {
    try {
        const { userID } = req.params;
        const user = await User.findOne({ userID });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        res.json(user);

    } catch (error) {
        next(error);
    }
})

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

        res.json(updatedUser);

    } catch (error) {
        next(error);
    }
})

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

        res.json(updatedUser);

    } catch (error) {
        next(error);
    }
})

router.delete('/:userID', async (req, res, next) => {
    try {
        const { userID } = req.params;
        const deletedUser = await User.findOneAndDelete({ userID });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.'});
        }

        res.json(deletedUser);

    } catch (error) {
        next(error);
    }
})

module.exports = router;