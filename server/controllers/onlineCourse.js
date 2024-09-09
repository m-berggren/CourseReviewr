import { express } from 'express';
import { OnlineCourse } from '../models/onlineCourse'

const router = express.Router();

router.post('/api/onlineCourse', function (request, response, next) {
    const onlineCourse = new OnlineCourse(request.body);
    onlineCourse.save(function (error, onlineCourse) {
        if (error) { return next(error); }
        response.json({'onlineCourse': onlineCourse});
    });
});

router.get('/api/onlineCourse', function (request, response, next) {
    OnlineCourse.find(function (error, onlineCourse) {
        if (error) { return next(error); }
        response.json({'onlineCourse': onlineCourse});
    });
});

router.get('/api/onlineCourse/:id', function (request, response, next) {
    const { id } = request.params;
    OnlineCourse.findById(id, function (error, onlineCourse) {
        if (error) { return next(error); }
        if (!onlineCourse) {
            return response.status(404).json({message: 'Online course not found!'});
        }
        response.json(onlineCourse);
    });
});

router.put('/api/onlineCourse/:id', async (request, response, next) => {
    const { id } = request.params;
    const updates = request.body;

    try {
        // Find course by ID and update with new data
        const updatedOnlineCourse = await OnlineCourse.findByIdAndUpdate(id, updates, {
            new: true, // Return modified document instead of original
            runValidators: true // Validates against existing schema
        });

        if (!updatedOnlineCourse) {
            return response.status(404).json({message: 'Online course not found.'})
        }
    } catch (error) {
        
    }


    let onlineCourse = new OnlineCourse(request.body);
    OnlineCourse.findById(id, function (error, onlineCourse) {
        if (error) { return next(error); }
        if (!onlineCourse) {
            return response.status(404).json({message: 'Online course not found.'})
        }
        
    })
});

router.patch('/api/onlineCourse', function (request, response, next) {
    /* Lorem ipsum */
})

router.delete('/api/onlineCourse/:id', function (request, response, next) {
    let id = request.params.id;
    OnlineCourse.findOneAndDelete({_id: id}, function (error, onlineCourse) {
        if (error) { return next(error); }
        if (!onlineCourse) {
            return response.status(404).json({'message': 'Online course not found.'});
        }
        response.json(onlineCourse);
    });
});

module.exports = router;
