const router = require('express').Router();
const Course = require('../models/course');


router.post('/', async (req, res, next) => {
    try {
        const course = new Course(req.body);
        await course.save();
        
        //implement HATEOAS, include hypermedia links in the response
        res.json({
             'Course': course,
             '_links':{
                'self':{ href: `/courses/${course.courseID}`},
                'update': { href:`/courses/${course.courseID}`, method: 'PUT' },
                'delete': { href:`/courses/${course.courseID}`, method: 'DELETE' },
                'listAll': { href:`/courses}`, method: 'GET' }
            } 
        });
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const courses = await Course.find();

        res.json({
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
            return res.status(404).json({ message: 'Course not found.' })
        }

        res.json({
            course,
            '_links': {
                'self': { href: `/courses/${course.courseID}`},
                'update': { href:`/courses/${course.courseID}`, method: 'PUT' },
                'delete': { href:`/courses/${course.courseID}`, method: 'DELETE' },
                'listAll': { href:`/courses}`, method: 'GET' }
            }
        });

    } catch (error) {
        next(error);
    }
})

router.put('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const updates = req.body;
        const updatedCourse = await Course.findOneAndUpdate(
            { courseID },
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.json({
            updatedCourse,
            '_links': {
                'self': { href: `/courses/${updatedCourse.courseID}`},
                'delete': { href: `courses/${updatedCourse.courseID}`, method: 'DELETE'},
                'listAll': { href: `/courses/`, method: 'GET'}
            }
        });

        } catch (error) {
            next(error);
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

        res.json({
            updatedCourse,
            '_links':{
                'self': {href: `/courses/${updatedCourse.courseID}`},
                'delete': {href:`/courses/${updatedCourse.courseID}`, method: 'DELETE'},
                'listAll': {href: `/courses/`, method: 'GET'}
            }
        });

    } catch (error) {
        next(error);
    }
})

router.delete('/:courseID', async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const deletedCourse = await Course.findOneAndDelete({ courseID });

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.json({
            deletedCourse,
            '_links':{
                'self': { href: `/courses`},
                'create': { href: `/courses`, method: 'POST'},
            }
        });

    } catch (error) {
        next(error);
    }
})

module.exports = router;
