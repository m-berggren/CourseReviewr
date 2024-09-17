import Review from '../models/review.js';
import express from 'express';

// Need to include mergeParams: true to mount the reviewRoutes in app.js to where they fit in the API structure
const router = express.Router({ mergeParams: true });

// Middleware to extract and validate IDs
const extractIds = (req, res, next) => {
    req.userID = req.params.userID ? Number(req.params.userID) : undefined;
    req.courseID = req.params.courseID ? Number(req.params.courseID) : undefined;
    req.reviewID = req.params.reviewID ? Number(req.params.reviewID) : undefined;
    next();
};
  
router.use(extractIds);

router.post('/', async(req, res, next) => {
    try{
        // Extract, cast IDs to numbers and destructure the request body
        let { userID, courseID } = req;
        const { rating, comment, hasCompleted } = req.body;

        // Cannot create a review without specifying userID and courseID
        if (!userID || !courseID) {
            return res.status(400).json({ error: 'Both userID and courseID are required'});
        }

        //Check if the user has already reviewed the course
        const existingReview = await Review.findOne({user: userID, course: courseID});
        if (existingReview){
            return res.status(400).json({error:'User has already reviewed this course'});
        }

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
        res.json({'Review': savedReview});
    } catch (error) {
        next(error);
    }
});


router.get('/', async(req, res, next) => {
    try {
        // Req with values are stored through middleware extractIDs
        let { userID, courseID } = req;

        // Populates query with userID and courseID if there is values
        let query = {};
        if (userID) query.user = userID;
        if (courseID) query.course = courseID; // 

        const reviews = await Review.find(query);

        res.json({ reviews });

    } catch (error) {
        next(error);
    }
});

router.get('/:reviewID', async(req, res, next) => {
    try {
        const { reviewID } = req;
        const review = await Review.findOne({ reviewID }).populate('user').populate('course');
        if (!review){
            return res.status(404).json({error: 'Review not found'});
        }

        res.json({review});

    } catch (error) {
        next(error);
    }
});


router.put('/:reviewID', async(req, res, next) => {
    try {
        const {reviewID }= req.params;
        const {user, course, rating, comment, hasCompleted}=req.body;

        const updatedReview = await Review.findOneAndUpdate(
            {reviewID},
            {user,course,rating,comment,hasCompleted},
            {new:true, runValidators:true, overwrite:true}
        );
        if (!updatedReview){
            return res.status(404).json({error:'Review not found'});
        }
        res.json(updatedReview);
    } catch (error) {
        next(error);
    }
});

// TODO: Appears to be overwriting
router.patch('/:reviewID', async(req,res,next) => {
    try {
        const {reviewID} = req.params;
        const updates = req.body;

        const updatedReview = await Review.findOneAndUpdate(
            {reviewID},
            {$set: updates},
            {new: true, runValidators:true}
        );

        if (!updatedReview){
            return res.status(404).json({error:'Review not found'});
        }
        res.json(updatedReview);
    } catch (error) {
        next(error);
    }
});

router.delete('/:reviewID', async(req,res,next) => {
    try {
        const {reviewID} = req.params;

        const deletedReview = await Review.findOneAndDelete({reviewID});
        if (!deletedReview){
            return res.status(404).json({error:'Review not found'});
        }
        res.json({message:'Review deleted successfully'});
    } catch (error) {
        next(error);
    }
});

export default router;