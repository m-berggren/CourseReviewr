import Review from '../models/review.js';
import express from 'express';

// Need to include mergeParams: true to mount the reviewRoutes in app.js to where they fit in the API structure
const router = express.Router({ mergeParams: true });

const handleError = (error, res) => {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'Review already exists.' });
    } else if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages });
    }
};

router.post('/', async(req, res, next) => {
    try{
        // Extract, cast IDs to numbers and destructure the request body
        let { userID, courseID } = req.params;
        userID, courseID = Number(userID), Number(courseID);
        const { rating, comment, hasCompleted } = req.body;

        //create and save the new review
        const newReview = new Review({
            user: userID,
            course: courseID,
            rating,
            comment,
            date: new Date(),
            hasCompleted
        });
        const savedReview = await newReview.save();
        res.status(201).json({'Review': savedReview});
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});


router.get('/', async(req, res, next) => {
    try {
        // Find the course using the custom integer courseID
        let { courseID } = req.params;
        courseID = Number(courseID);
 
        const reviews = await Review.find({ course: courseID });

        res.status(200).json({ reviews });

    } catch (error) {
        next(error);
    }
});

router.get('/:reviewID', async(req, res, next) => {
    try {
        const reviewID = Number(req.params.reviewID);
        const review = await Review.findOne({ reviewID });
        if (!review){
            return res.status(404).json({error: 'Review not found'});
        }

        res.status(200).json({review});

    } catch (error) {
        next(error);
    }
});


router.put('/:reviewID', async(req, res, next) => {
    try {
        const reviewID = Number(req.params.reviewID);
        const {user, course, rating, comment, hasCompleted}=req.body;

        const updatedReview = await Review.findOneAndUpdate(
            {reviewID},
            {user,course,rating,comment,hasCompleted},
            {new:true, runValidators:true, overwrite:true}
        );
        if (!updatedReview){
            return res.status(404).json({error:'Review not found'});
        }
        res.status(200).json(updatedReview);
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

// TODO: Appears to be overwriting
router.patch('/:reviewID', async(req,res,next) => {
    try {
        const reviewID = Number(req.params.reviewID);
        const updates = req.body;

        const updatedReview = await Review.findOneAndUpdate(
            {reviewID},
            {$set: updates},
            {new: true, runValidators:true}
        );

        if (!updatedReview){
            return res.status(404).json({error:'Review not found'});
        }
        res.status(200).json(updatedReview);
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.delete('/:reviewID', async(req,res,next) => {
    try {
        const {reviewID} = req.params;

        const deletedReview = await Review.findOneAndDelete({reviewID});
        if (!deletedReview){
            return res.status(404).json({error:'Review not found'});
        }
        res.status(200).json({message:'Review deleted successfully'});
    } catch (error) {
        next(error);
    }
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ message: 'Internal Server Error.' });
});

export default router;