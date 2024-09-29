import Course from '../models/course.model.js';
import Review from '../models/review.model.js';
import { roundToNearestHalf } from './mathUtil.js';

export const getCourseWithAverageRatingAndCount = async (courseId) => {
    try {
        // Fetch the course
        const course = await Course.findById(courseId);
        if (!course) {
            return { error: 'Course not found' };
        }

        // Fetch all reviews for the course
        const reviews = await Review.find({ course: courseId });
        const reviewCount = reviews.length;

        // If there are no reviews, set averageRating to 0
        if (reviews.length === 0) {
            return { ...course.toObject(), averageRating: 0, reviewCount: 0};
        }

        // Calculate the average rating from the virtual `averageRating` of each review
        const averageRating = reviews.reduce((acc, review) => acc + review.averageRating, 0) / reviews.length;

        const roundedAverageRating = roundToNearestHalf(averageRating);

        // Return the course data along with the dynamically calculated average rating
        return { ...course.toObject(), averageRating: roundedAverageRating, reviewCount};
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching course and reviews');
    }
};