import express from 'express';
import CourseList from '../models/course-list.js';

const router = express.Router({ mergeParams: true });

const handleError = (error, res) => {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'CourseList already exists.' });
    } else if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages });
    }
};

router.post('/', async (req, res, next) => {
    try {
        // Find the user through custom userID
        let { userID } = req.params;
        userID = Number(userID);

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
        return handleError(error, res) || next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        // Find the user through custom userID
        let { userID } = req.params;
        userID = Number(userID);

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
        const updatedCourseList = await CourseList.findOneAndUpdate(
            {courseListID},
            {...updates},
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
        return handleError(error, res) || next(error);
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