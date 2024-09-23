import express from 'express';
import CourseList from '../models/course-list.js';
import User from '../models/user.js';
import { authenticateJWT, requireAdmin } from './auth.js';

const router = express.Router({ mergeParams: true });

const handleError = (error, res) => {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'CourseList already exists.' });
    } else if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages });
    } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
};

router.post('/', authenticateJWT, async (req, res, next) => {
    try {
        // Find the user through custom userID
        const userID = req.params.userID;
        const { name, description, courses } = req.body;
        const newCourseList = new CourseList({
            name,
            creationDate: new Date(),
            user: userID,
            description,
            courses
        });
        const savedCourseList = await newCourseList.save();

        // Update the user's courseLists array
        await User.findByIdAndUpdate(
            userID,
            { $push: { courseLists: savedCourseList._id } },
            { new: true }
        );

        res.status(201).json(savedCourseList);
    } catch (error) {
        next(error);
    }
});

router.get('/', authenticateJWT, requireAdmin, async (req, res, next) => {
    try {
        const user = req.params.userID;
        const courseLists = await CourseList.find({ user }).populate('courses');
        res.status(200).json(courseLists);
    } catch (error) {
        handleError(error, res) || next(error);
    }
});

router.get('/:id', authenticateJWT, async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const id = req.params.id;

        const isAdmin = req.user.role === 'admin';

        const courseList = await CourseList.findById(id).populate('user').populate('courses');
        if (!courseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }

        // Check if the user is an admin or if they are the owner of the CourseList
        if (!isAdmin && courseList.user._id.toString() !== userIdFromToken) {
            return res.status(403).json({ message: 'Forbidden: You can only get your own course list.' });
        }

        res.status(200).json(courseList);
    } catch (error) {
        handleError(error, res) || next(error);
    }
});

router.put('/:id', authenticateJWT, async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const id = req.params.id;
        const updates = req.body;

        const isAdmin = req.user.role === 'admin';

        // Find the CourseList to check ownership
        const courseList = await CourseList.findById(id);
        if (!courseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }

        // Check if the user is an admin or if they are the owner of the CourseList
        if (!isAdmin && courseList.user._id.toString() !== userIdFromToken) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own course list.' });
        }

        const updatedCourseList = await CourseList.findByIdAndUpdate(
            id,
            { ...updates },
            { new: true, runValidators: true, overwrite: true }
        );

        if (!updatedCourseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
        res.status(200).json(updatedCourseList);
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.patch('/:id', authenticateJWT, async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const id = req.params.id;
        const updates = req.body;

        const isAdmin = req.user.role === 'admin';

        // Find the CourseList to check ownership
        const courseList = await CourseList.findById(id);
        if (!courseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }

        // Check if the user is an admin or if they are the owner of the CourseList
        if (!isAdmin && courseList.user._id.toString() !== userIdFromToken) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own course list.' });
        }

        const updatedCourseList = await CourseList.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true });
        if (!updatedCourseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
        res.status(200).json(updatedCourseList);
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.delete('/', authenticateJWT, requireAdmin, async (req, res, next) => {
    try {
        // First, find all course lists before deletion
        const courseLists = await CourseList.find(); // Get all course lists

        if (courseLists.length === 0) {
            res.status(404).json({ message: 'No course-lists found to delete.'});
        }

        
        // Remove references from users' courseLists
        await User.updateMany(
            { courseLists: { $in: courseLists.map(list => list._id) } },
            { $pull: { courseLists: { $in: courseLists.map(list => list._id) } } }
        );

        // Now delete all course lists
        const deleteResult = await CourseList.deleteMany();

        res.status(200).json({ message: `${deleteResult.deletedCount} course-lists deleted successfully.` });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticateJWT, async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const id = req.params.id;

        const isAdmin = req.user.role === 'admin';

        // Find the CourseList to check ownership
        const courseList = await CourseList.findById(id);
        if (!courseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }

        // Check if the user is an admin or if they are the owner of the CourseList
        if (!isAdmin && courseList.user._id.toString() !== userIdFromToken) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own course list.' });
        }
        
        const deletedCourseList = await CourseList.findByIdAndDelete(id);
        if (!deletedCourseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }

        // Remove the course list reference from the user's courseLists
        await User.updateMany(
            { courseLists: id },
            { $pull: { courseLists: id } }
        );

        res.status(200).json(deletedCourseList);
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.use((err, req, res) => {
    console.error(err.stack);
    return res.status(500).json({ message: 'Internal Server Error.' });
});

export default router;