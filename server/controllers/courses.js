import express from 'express';
import Course from '../models/course.js';

const router = express.Router();

const handleError = (error, res) => {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'Course already exists.' });
    } else if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages });
    }
};

router.post('/', async (req, res, next) => {
    try {
        const course = new Course(req.body);
        await course.save();
        
        //implement HATEOAS, include hypermedia links in the response
        res.status(201).json({
            'Course': course,
            '_links':{
                'self':{ href: `/courses/${course.courseID}`},
                'update': { href:`/courses/${course.courseID}`, method: 'PUT' },
                'delete': { href:`/courses/${course.courseID}`, method: 'DELETE' },
                'listAll': { href:'/courses', method: 'GET' }
            } 
        });
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            courses,
            '_links': {
                'self': { href: '/courses/'},
                'create': {href: '/courses', method: 'POST'},
            }
        });

    } catch (error) {
        next(error);
    }
});

router.get('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const course = await Course.findOne({ courseID });

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.status(200).json({
            course,
            '_links': {
                'self': { href: `/courses/${course.courseID}`},
                'update': { href:`/courses/${course.courseID}`, method: 'PUT' },
                'delete': { href:`/courses/${course.courseID}`, method: 'DELETE' },
                'listAll': { href:'/courses', method: 'GET' }
            }
        });

    } catch (error) {
        next(error);
    }
});

router.put('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const updates = req.body;
        const updatedCourse = await Course.findOneAndUpdate(
            { courseID },
            { ...updates },
            { new: true, runValidators: true, overwrite: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.status(200).json({
            updatedCourse,
            '_links': {
                'self': { href: `/courses/${updatedCourse.courseID}`},
                'delete': { href: `courses/${updatedCourse.courseID}`, method: 'DELETE'},
                'listAll': { href: '/courses/', method: 'GET'}
            }
        });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});


router.patch('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const updates = req.body;
        const updatedCourse = await Course.findOneAndUpdate(
            { courseID },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.status(200).json({
            updatedCourse,
            '_links':{
                'self': {href: `/courses/${updatedCourse.courseID}`},
                'delete': {href:`/courses/${updatedCourse.courseID}`, method: 'DELETE'},
                'listAll': {href: '/courses/', method: 'GET'}
            }
        });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.delete('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const deletedCourse = await Course.findOneAndDelete({ courseID });

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.status(200).json({
            deletedCourse,
            '_links':{
                'self': { href: '/courses'},
                'create': { href: '/courses', method: 'POST'},
            }
        });

    } catch (error) {
        next(error);
    }
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ message: 'Internal Server Error.' });
});

export default router;
