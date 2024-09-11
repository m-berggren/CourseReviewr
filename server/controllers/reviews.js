
const review = require('../models/review');
const user = require('../models/user');
const course = require('../models/course')
const router = require('express').Router();



router.post('/', async(req, res, next) => {
    try{
        const {userID, courseID, rating, comment} = req.body;

        //Check if the user has already reviewd the course
        const existingReview = await Review.findOne({user: userID, course: courseID});
        if (existingReview){
            return res.status(400).json({error:'User has already reviewd this course'});
        }

        //create and save the new review
        const newReview = new Review({
            user:userID,
            course: courseID,
            rating,
            comment,
            date,
            hasCompleted
         });
        const savedReview = await newReview.save();
        res.json({'Review': savedReview})
    } catch (error) {
        next(error);
    }
});


router.get('/', async(req, res, next)=>{
    try {
        const reviews = await Review.find().populate('user').populate('course');
        res.json({reviews})
    } catch (error) {
        next(error);
    }
});


router.get('/:reviewID', async(req, res, next)=> {
    try {
        const {reviewID}=req.params;
        const review = await Review.findOne({reviewID}).populate('user').populate('course');
        if (!review){
            return res.status(404).json({error: 'Review not found'})
        }
        res.json({review})

    } catch (error) {
        next(error);
    }
});

router.put('/:reviewID', async(req, res, next)=>{
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
    } catch (error) {
        next(error)
    }
});

router.patch('/:reviewID', async(req,res,next)=>{
    try {
        const {reviewID} =req.params;
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
        next(error)
    }
});

router.delete('/:reviewID', async(req,res,next)=>{
    try {
        const {reviewID} = req.params;

        const deletedReview = await Review.findOneAndDelete({reviewID});
        if (!deletedReview){
            return res.status(404).json({error:'Review not found'});
        }
        res.json({message:'Review deleted successfully'})
    } catch (error) {
        next(error)
    }
});

module.exports = router;