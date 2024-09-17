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
    } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
};


router.post('/', async(req, res, next) => {
    try{
        let { userID, courseID } = req.params;
        const review = req.body;

        

        // Cannot create a review without specifying userID and courseID in the parameters
        if (!userID || !courseID) {
            return res.status(400).json({ error: 'UserID and/or courseID are required'});
        }

        //Check if the user has already reviewed the course
        const existingReview = await Review.findOne({user: userID, course: courseID});
        if (existingReview) {
            return res.status(400).json({ error: 'User has already reviewed this course' });
        }
        
        const newReview = new Review({
            user: userID,
            course: courseID,
            date: new Date(),
            ...review
        });

        const savedReview = await newReview.save();
        res.status(201).json({
            savedReview,
            _links: {
                self: { href: `/api/reviews/${savedReview._id}`, method: 'GET' },
                update: { href: `/api/reviews/${savedReview._id}`, method: 'PUT' },
                delete: { href: `/api/reviews/${savedReview._id}`, method: 'DELETE' },
                allReviewsForCourse: { href: `/api/reviews?courseID=${courseID}`, method: 'GET' },
                allReviewsForUser: { href: `/api/reviews?userID=${userID}`, method: 'GET' }
            }
        });
    } catch (error) {
        return next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const { userID, courseID } = req.params;
        const { sortBy = 'date', order = 'desc' } = req.query;
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
        if (limit <= 0 || page < 0) {
            return res.status(400).json({ error: 'limit and page must be positive integers' });
        }

        const reviews = await Review.find(filter).populate('user').populate('course').sort(sortOptions).limit(limit).skip((page - 1) * limit);
        const totalReviews = await Review.countDocuments(filter);
        const totalPages = Math.ceil(totalReviews / limit);

        //calculate pagination data
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;


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
                self: { href: `/api/reviews?limit=${limit}&page=${page}`, method: 'GET' },
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

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await Review.findById(id).populate('user').populate('course');
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json({
            review,
            _links: {
                self: { href: `/api/reviews/${id}`, method: 'GET' },
                update: { href: `/api/reviews/${id}`, method: 'PUT' },
                delete: { href: `/api/reviews/${id}`, method: 'DELETE' },
            }

        });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        // using spread operator (...) to update values
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { ...updates },
            { new: true, runValidators: true, overwrite: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json({
            updatedReview,
            _links: {
                self: { href: `/api/reviews/${id}`, method: 'GET' },
                update: { href: `/api/reviews/${id}`, method: 'PUT' },
                delete: { href: `/api/reviews/${id}`, method: 'DELETE' },
            },
        });
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(req.params);
        const updates = req.body;
        console.log(req.body);

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json({
            updatedReview,
            _links: {
                self: { href: `/api/reviews/${id}`, method: 'GET' },
                update: { href: `/api/reviews/${id}`, method: 'PUT' },
                delete: { href: `/api/reviews/${id}`, method: 'DELETE' },
            },
        });
    } catch (error) {
        return handleError(error, res) || next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        const deletedReview = await Review.findByIdAndDelete(id);
        if (!deletedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json({
            message: 'Review deleted successfully',
            _links: {
                allReviews: { href: '/api/reviews', method: 'GET' },
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