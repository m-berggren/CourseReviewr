const express = require('express');
const Course = require('../models/course');

const router = express.Router();

router.post('/', async function (request, response, next) {
    try {
        const newCourse = new Course(request.body);
        const savedCourse = await newCourse.save(); // Await save operation
        response.json({'Course': savedCourse});
    } catch (error) {
        next(error);
    }
});


router.get('/', async (request, response, next) => {
    try {
        const courses = await Course.find();
        response.json({ courses });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', function (request, response, next) {
    const { id } = request.params;
    Course.findById(id, function (error, course) {
        if (error) { return next(error); }
        if (!course) {
            return response.status(404).json({message: 'Course not found!'});
        }
        response.json(course);
    });
});

// TODO - not yet ready
/*
router.put('/:id', async (request, response, next) => {
    const { id } = request.params;
    const updates = request.body;

    try {
        // Find course by ID and update with new data
        const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
            new: true, // Return modified document instead of original
            runValidators: true // Validates against existing schema
        });

        if (!updatedCourse) {
            return response.status(404).json({message: 'Course not found.'})
        }
    } catch (error) {
        
    }

    let Course = new Course(request.body);
    Course.findById(id, function (error, Course) {
        if (error) { return next(error); }
        if (!Course) {
            return response.status(404).json({message: 'Course not found.'})
        }
        
    })
});
*/

router.patch('/', function (request, response, next) {
    /* TODO */
})

router.delete('/:id', function (request, response, next) {
    let { id } = request.params;
    Course.findOneAndDelete({_id: id}, function (error, course) {
        if (error) { return next(error); }
        if (!course) {
            return response.status(404).json({'message': 'Course not found.'});
        }
        response.json(course);
    });
});

module.exports = router;
