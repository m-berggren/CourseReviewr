import User from '../models/user.js';
import { handleError } from '../middleware/error.middleware.js';

const createUser = async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.status(201).json(user);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json(users);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const getUser = async (req, res, next) => {
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
};

const updateUser = async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const userIdToUpdate = req.params.id;
        const updates = req.body;

        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && userIdFromToken != userIdToUpdate) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
        }

        // using spread operator (...) to update values
        const updatedUser = await User.findByIdAndUpdate(
            userIdToUpdate,
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
};

const patchUser = async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const userIdToUpdate = req.params.id;
        const updates = req.body;

        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && userIdFromToken != userIdToUpdate) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userIdToUpdate,
            updates, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.'});
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const deleteAllUsers = async (req, res, next) => {
    try {
        const users = await User.deleteMany({ username : { $ne: 'admin' } });

        if (users.deletedCount === 0) {
            return res.status(404).json({ message: 'No users found to delete.' });
        }

        res.status(200).json({ message: `${users.deletedCount} users deleted successfully.` });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const deleteUser = async (req, res, next) => {
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
};

const controller = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    patchUser,
    deleteAllUsers,
    deleteUser
};

export default controller;