import Course from '../models/course.model.js';
import { handleError } from '../utils/error.util.js';

const createCourse = async (req, res, next) => {
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
};

const getAllCourses = async (req, res, next) => {
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
};

const getCourse = async (req, res, next) => {
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
};

const updateCourse = async (req, res, next) => {
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
};


const patchCourse = async (req, res, next) => {
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
};

const deleteAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.deleteMany();

        if (courses.deletedCount === 0) {
            return res.status(404).json({ message: 'No courses found to delete.'});
        }

        return res.status(200).json({ message: `${courses.deletedCount} courses deleted successfully.` });
    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
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
};

const controller = {
    createCourse,
    getAllCourses,
    getCourse,
    updateCourse,
    patchCourse,
    deleteAllCourses,
    deleteCourse
};

export default controller;
