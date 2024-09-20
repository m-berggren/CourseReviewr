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
        let { userID, courseID } = req;
        const review = req.body;

        // Cannot create a review without specifying userID and courseID
        if (!userID || !courseID) {
            return res.status(400).json({ error: 'UserID and/or courseID are required'});
        }

        //create and save the new review
        const newReview = new Review({
            user: userID,
            course: courseID,
            date: new Date(),
            ...review
        });

        const savedReview = await newReview.save();
        res.status(201).json({
            Review: savedReview,
            _links: {
                self: { href: `/api/reviews/${savedReview.reviewID}`, method: 'GET' },
                update: { href: `/api/reviews/${savedReview.reviewID}`, method: 'PUT' },
                delete: { href: `/api/reviews/${savedReview.reviewID}`, method: 'DELETE' },
                allReviewsForCourse: { href: `/api/reviews?courseID=${courseID}`, method: 'GET' },
                allReviewsForUser: { href: `/api/reviews?userID=${userID}`, method: 'GET' }
            }
        });
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.get('/', async(req, res, next) => {
    try {
        const {userID, courseID} = req;
        const {sortBy = 'date', order = 'desc'} = req.query;
        const filter = {};
 
        // Add filtering conditions if query parametes are provided
        if (userID) filter.user = userID;
        if (courseID) filter.course = courseID;

        // Define sorting fields
        const validSortFields = ['date', 'rating'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';

        // Define the sort object
        const sortOptions = {};
        sortOptions[sortField] = order === 'asc' ? 1 : -1;

        // Add pagination 
        const limit = parseInt(req.query.limit, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        if (limit<= 0 || page < 0) {
            return res.status(400).json({error: 'limit and page must be positive integers'});
        }
        
        const reviews = await Review.find(filter).sort(sortOptions).limit(limit).skip((page-1)*limit);
        const totalReviews = await Review.countDocuments(filter);
        const totalPages = Math.ceil(totalReviews/limit);

        //calculate pagination data
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1: null;
        const nextPage = hasNextPage ? page + 1: null;


        res.status(200).json({ 
            totalReviews,
            totalPages,
            currentPage: page,
            limit: limit,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            reviews, 
            _links: {
                self: {href: `/api/reviews?limit=${limit}&page=${page}`, method: 'GET'},
                next: hasNextPage
                    ? { href: `/api/reviews?limit=${limit}&page=${nextPage}`, method: 'GET' }
                    : null,
                prev: hasPrevPage
                    ? { href: `/api/reviews?limit=${limit}&page=${prevPage}`, method: 'GET' }
                    : null,
            }
        });
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

        res.status(200).json({
            review,
            _links: {
                self: { href: `/api/reviews/${reviewID}`, method: 'GET' },
                update: { href: `/api/reviews/${reviewID}`, method: 'PUT' },
                delete: { href: `/api/reviews/${reviewID}`, method: 'DELETE' },}

        });

    } catch (error) {
        next(error);
    }
});

router.put('/:reviewID', async(req, res, next) => {
    try {
        const reviewID = Number(req.params.reviewID);
        const updates = req.body;

        // using spread operator (...) to update values
        const updatedReview = await Review.findOneAndUpdate(
            { reviewID },
            {...updates},
            { new: true, runValidators: true, overwrite: true }
        );

        if (!updatedReview){
            return res.status(404).json({error:'Review not found'});
        }
        res.status(200).json({
            review: updatedReview,
            _links: {
                self: { href: `/api/reviews/${reviewID}`, method: 'GET' },
                update: { href: `/api/reviews/${reviewID}`, method: 'PUT' },
                delete: { href: `/api/reviews/${reviewID}`, method: 'DELETE' },
            },
        });
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

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
        res.status(200).json({
            review: updatedReview,
            _links: {
                self: { href: `/api/reviews/${reviewID}`, method: 'GET' },
                update: { href: `/api/reviews/${reviewID}`, method: 'PUT' },
                delete: { href: `/api/reviews/${reviewID}`, method: 'DELETE' },
            },
        });
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
        res.status(200).json({
            message:'Review deleted successfully',
            _links:{
                allReviews: { href: '/api/reviews', method: 'GET'},
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