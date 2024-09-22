import express from 'express';
import CourseList from '../models/course-list.js';
<<<<<<< HEAD
import User from '../models/user.js';
import authenticateJWT from './auth.js';
=======
import { authenticateJWT } from './auth.js';
>>>>>>> 0e2e066 (#17 Add authentication to course-lists.js)

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

router.get('/', async (req, res, next) => {
    try {
        const user = req.params.userID;
        const courseLists = await CourseList.find({ user }).populate('courses');
        res.status(200).json(courseLists);
    } catch (error) {
        handleError(error, res) || next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const courseList = await CourseList.findById(id).populate('user').populate('courses');
        if (!courseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
        res.status(200).json(courseList);
    } catch (error) {
        handleError(error, res) || next(error);
    }
});

<<<<<<< HEAD
router.put('/:id', async (req, res, next) => {
=======
router.put('/:courseListID', authenticateJWT, async (req, res, next) => {
>>>>>>> 0e2e066 (#17 Add authentication to course-lists.js)
    try {
        const id = req.params.id;
        const updates = req.body;
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

<<<<<<< HEAD
router.patch('/:id', async (req, res, next) => {
=======
router.patch('/:courseListID', authenticateJWT, async (req, res, next) => {
>>>>>>> 0e2e066 (#17 Add authentication to course-lists.js)
    try {
        const id = req.params.id;
        const updates = req.body;
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

<<<<<<< HEAD
router.delete('/:id', async (req, res, next) => {
=======
router.delete('/:courseListID', authenticateJWT, async (req, res, next) => {
>>>>>>> 0e2e066 (#17 Add authentication to course-lists.js)
    try {
        const id = req.params.id;
        const deletedCourseList = await CourseList.findByIdAndDelete(id);
        if (!deletedCourseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
        res.status(200).json(deletedCourseList);
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

<<<<<<< HEAD
router.use((err, req, res) => {
=======

router.use((err, req, res, next) => {
>>>>>>> 0e2e066 (#17 Add authentication to course-lists.js)
    console.error(err.stack);
    return res.status(500).json({ message: 'Internal Server Error.' });
});

export default router;