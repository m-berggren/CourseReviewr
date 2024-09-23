import express from 'express';
import Course from '../models/course.js';
import { authenticateJWT, requireAdmin } from './auth.js';

const router = express.Router();

const handleError = (error, res) => {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'Course already exists.' });
    } else if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages });
    } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
};

router.post('/', authenticateJWT, async (req, res, next) => {
    try {
        const course = new Course(req.body);
        await course.save();
        
        //implement HATEOAS, include hypermedia links in the response
        res.status(201).json({
            course,
            '_links':{
                'self':{ href: `/courses/${course._id}`},
                'update': { href:`/courses/${course._id}`, method: 'PUT' },
                'delete': { href:`/courses/${course._id}`, method: 'DELETE' },
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

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.status(200).json({
            course,
            '_links': {
                'self': { href: `/courses/${course._id}`},
                'update': { href:`/courses/${course._id}`, method: 'PUT' },
                'delete': { href:`/courses/${course._id}`, method: 'DELETE' },
                'listAll': { href:'/courses', method: 'GET' }
            }
        });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.put('/:id', authenticateJWT, async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { ...updates },
            { new: true, runValidators: true, overwrite: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.status(200).json({
            updatedCourse,
            '_links': {
                'self': { href: `/courses/${id}`},
                'delete': { href: `courses/${id}`, method: 'DELETE'},
                'listAll': { href: '/courses/', method: 'GET'}
            }
        });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});


router.patch('/:id', authenticateJWT, async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.status(200).json({
            updatedCourse,
            '_links':{
                'self': {href: `/courses/${id}`},
                'delete': {href:`/courses/${id}`, method: 'DELETE'},
                'listAll': {href: '/courses/', method: 'GET'}
            }
        });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.delete('/', authenticateJWT, requireAdmin, async (req, res, next) => {
    try {
        const courses = await Course.deleteMany();

        if (courses.deletedCount === 0) {
            return res.status(404).json({ message: 'No courses found to delete.'});
        }

        return res.status(200).json({ message: `${courses.deletedCount} courses deleted successfully.` });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticateJWT, requireAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedCourse = await Course.findByIdAndDelete(id);

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
        return handleError(error, res) || next(error);
    }
});

router.use((err, req, res) => {
    console.error(err.stack);
    return res.status(500).json({ message: 'Internal Server Error.' });
});

export default router;
