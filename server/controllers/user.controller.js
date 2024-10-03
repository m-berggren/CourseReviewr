import User from '../models/user.model.js';
import { handleError } from '../utils/error.util.js';
import { hashPassword } from '../utils/password.util.js';

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
        const user = await User.findById(id)
            .populate('courseLists')
            .populate('recommendationList')
            .populate('interests');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // If the user has a photo, convert it to base64
        let photo;
        if (user.photo && user.photo.data) {
            photo = `data:${user.photo.contentType};base64,${user.photo.data.toString('base64')}`;
        } else {
            photo = null;
        }
        res.status(200).json({ ...user.toObject(), photo });

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
            { ...updates },
            { new: true, runValidators: true, overwrite: true }
        );

        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

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

        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

        if (updates.removeInterestId) {
            const updatedUser = await User.findByIdAndUpdate(
                userIdToUpdate,
                { $pull: { interests: updates.removeInterestId } },
                { new: true, runValidators: true }
            ).populate('interests');
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json(updatedUser);
        }

        // If a photo is uploaded, add it to the update object
        if (req.file) {
            updates.photo = {
                data: req.file.buffer,         // Store the image as a Buffer
                contentType: req.file.mimetype // Store the MIME type (e.g., image/jpeg)
            };
        }


        const updatedUser = await User.findByIdAndUpdate(
            userIdToUpdate,
            updates, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // If the user has an updated photo, include the base64 encoded version in the response
        const userResponse = {
            ...updatedUser._doc,
            photo: updatedUser.photo
                ? `data:${updatedUser.photo.contentType};base64,${updatedUser.photo.data.toString('base64')}`
                : null
        };
        res.status(200).json(userResponse);



    } catch (error) {
        return handleError(error, res) || next(error);
    }
};


const deleteAllUsers = async (req, res, next) => {
    try {
        const users = await User.deleteMany({ username: { $ne: 'admin' } });

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
            return res.status(404).json({ message: 'User not found.' });
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