const router = require('express').Router();
const Course = require('../models/course');


router.post('/', async (req, res, next) => {
    try {
        const course = new Course(req.body);
        await course.save();
        
        res.json({ 'Course': course });

    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const courses = await Course.find();

        res.json({ courses });

    } catch (error) {
        next(error);
    }
});

router.get('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const course = await Course.findOne({ courseID });

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' })
        }

        res.json(course);

    } catch (error) {
        next(error);
    }
})

router.put('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const updates = req.body;
        const updatedCourse = await Course.findOneAndUpdate({ courseID }, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.json(updatedCourse);

    } catch (error) {
        next(error);
    }
});


router.patch('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const updates = req.body;
        const updatedCourse = await Course.findOneAndUpdate({ courseID }, { $set: updates }, {
            new: true,
            runValidators: true
        });

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.json(updatedCourse);

    } catch (error) {
        next(error);
    }
})

router.delete('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = reg.params;
        const deletedCourse = await Course.findOneAndDelete({ courseID });

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.json(deletedCourse);

    } catch (error) {
        next(error);
    }
})

module.exports = router;
