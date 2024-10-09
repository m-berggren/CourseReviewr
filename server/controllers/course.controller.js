import Course from '../models/course.model.js';
import { handleError } from '../utils/error.util.js';
import mongoose from 'mongoose';
import Review from '../models/review.model.js';

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
        const { topic, sortBy, order = 'desc' } = req.query;
        const filter = {};

        /*
        * If a topic is provided and it's a valid ObjectId,
        * use $in to filter courses that have the topic in their topics array
        */
        if (topic) filter.topics = { $in: [new mongoose.Types.ObjectId(topic)] };

        // Validate sortFields in query, otherwise choose default
        const validSortFields = ['reviewCount', 'averageRating', 'topicCount'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'reviewCount';

        // Define the sort object for primary and secondary sorting
        const sortOptions = {
            [sortField]: order === 'asc' ? 1 : -1,
            averageRating: -1
        };

        // Add pagination
        const limit = Math.min(parseInt(req.query.limit) || 12, 20);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        if (limit <= 0 || page < 0) {
            return res.status(400).json({ error: 'Limit and page must be positive integers' });
        }
        const skip = (page - 1) * limit;

        // Use aggregation pipeline to calculate reviewCount and averageRating
        const courses = await Course.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'course',
                    as: 'reviews'
                }
            },
            {
                $lookup: {
                    from: 'topics',
                    localField: 'topics',
                    foreignField: '_id',
                    as: 'topics'
                }
            },
            {
                $addFields: {
                    reviewCount: { $size: '$reviews' },
                    averageRating: { 
                        $cond: {
                            if: { $eq: [{ $size: '$reviews' }, 0] },
                            then: 0,
                            else: { $divide: [{ $multiply: [{ $avg: '$reviews.averageRating' }, 2] }, 2]}
                        }
                    }
                }
            },
            { $sort: sortOptions },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    averageRating: 1,
                    reviewCount: 1,
                    name: 1,
                    provider: 1,
                    difficulty: 1,
                    description: 1,
                    instructor: 1,
                    topics: 1,
                    photo: 1,
                    releaseYear: 1
                }
            }
        ]);

        const totalCourses = await Course.countDocuments(filter);
        const totalPages = Math.ceil(totalCourses / limit );

        //calculate pagination data
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        res.status(200).json({
            courses,
            totalCourses,
            totalPages,
            currentPage: page,
            limit,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
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

const getAggregatedRatings = async (req, res, next) => {
    const { id } = req.params;
  
    try {
        const aggregatedRatings = await Review.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: '$course',
                    averageEngagementLevel: { $avg: '$engagementLevel' },
                    averagePracticalValue: { $avg: '$practicalValue' },
                    averageInstructorQuality: { $avg: '$instructorQuality' },
                    averageDifficultyLevel: { $avg: '$difficultyLevel' }
                }
            }
        ]);
  
        if (aggregatedRatings.length === 0) {
            return res.json({
                averageEngagementLevel: 0,
                averagePracticalValue: 0,
                averageInstructorQuality: 0,
                averageDifficultyLevel: 0
            });
        }
  
        res.status(200).json(aggregatedRatings[0]);
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
    getAggregatedRatings,
    updateCourse,
    patchCourse,
    deleteAllCourses,
    deleteCourse
};

export default controller;
