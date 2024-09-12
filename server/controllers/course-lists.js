const router = require('express').Router();
const CourseList = require('../models/courseList');

router.post('/', async (req, res, next) => {
    try {
        const newCourseList = new CourseList(req.body);
        const savedCourseList = await newCourseList.save();
        res.json({'CourseList': savedCourseList});
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const courseLists = await CourseList.find().populate('userID').populate('courses');
        res.json({ courseLists });
    } catch (error) {
        next(error);
    }
});

router.get('/:courseListID', async (req, res, next) => {
    try {
        const {courseListID} = req.params;
        const courseList = await CourseList.findOne({courseListID}).populate('userID').populate('courses');
        if (!courseList) {
            return res.status(404).json({message: 'CourseList not found.'})
        }
        res.json(courseList);
    } catch (error) {
        next(error);
    }
})

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
        res.json(updatedCourseList);
    } catch (error) {
        next(error);
    }
});

router.patch('/:courseListID', async (req, res, next) => {
    try {
        const {courseListID} = req.params;
        const updates = req.body;
        const updatedCourseList = await CourseList.findOneAndUpdate({courseListID}, {$set: updates}, {
            new: true,
            runValidators: true
        })
        if (!updatedCourseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
        res.json(updatedCourseList);
    } catch (error) {
        next(error);
    }
})

router.delete('/:courseListID', async (req, res, next) => {
    try {
        const {courseListID} = req.params;
        const deletedCourseList = await CourseList.findOneAndDelete({courseListID});
        if (!deletedCourseList) {
            return res.status(404).json({message: 'CourseList not found.'});
        }
    } catch (error) {
        next(error);
    }
})

module.exports = router;