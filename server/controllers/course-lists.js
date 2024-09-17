import express from 'express';
import CourseList from '../models/course-list.js';

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res, next) => {
    try {
        // Find the user through custom userID
        let { userID } = req.params;
        userID = Number(userID);

        if (!userID) {
            return res.status(400).json({ message: 'UserID is required.' });
        }

        const { name, description, courses } = req.body;
        const newCourseList = new CourseList({
            name,
            creationDate: new Date(),
            userID: userID,
            description,
            courses
        });
        const savedCourseList = await newCourseList.save();
        res.status(201).json({'CourseList': savedCourseList});
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages});
        } else {
            next(error);
        }
    }
});

router.get('/', async (req, res, next) => {
    try {
        // Find the user through custom userID
        let { userID } = req.params;
        userID = Number(userID);

        if (!userID) {
            return res.status(400).json({ message: 'UserID is required.' });
        }

        const courseLists = await CourseList.find({ userID });
        res.status(200).json({ courseLists });
    } catch (error) {
        next(error);
    }
});

router.get('/:courseListID', async (req, res, next) => {
    try {
        const { courseListID } = req.params;
        const courseList = await CourseList.findOne({ courseListID });
        if (!courseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
        res.status(200).json(courseList);
    } catch (error) {
        next(error);
    }
});

router.put('/:courseListID', async (req, res, next) => {
    try {
        const {courseListID} = req.params;
        const updates = req.body;
        const updatedCourseList = await CourseList.findOneAndUpdate({courseListID}, updates, {
            new: true,
            runValidators: true
        });
        if (!updatedCourseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
        res.status(200).json(updatedCourseList);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages});
        } else {
            next(error);
        }
    }
});

router.patch('/:courseListID', async (req, res, next) => {
    try {
        const {courseListID} = req.params;
        const updates = req.body;
        const updatedCourseList = await CourseList.findOneAndUpdate({courseListID}, {$set: updates}, {
            new: true,
            runValidators: true
        });
        if (!updatedCourseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
        res.status(200).json(updatedCourseList);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages});
        } else {
            next(error);
        }
    }
});

router.delete('/:courseListID', async (req, res, next) => {
    try {
        const {courseListID} = req.params;
        const deletedCourseList = await CourseList.findOneAndDelete({courseListID});
        if (!deletedCourseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
        res.status(200).json(deletedCourseList);
    } catch (error) {
        next(error);
    }
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ message: 'Internal Server Error.' });
});

export default router;