import mongoose from 'mongoose';
import { roundToNearestHalf } from '../utils/mathUtil.js';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    user:                   { type: Schema.Types.ObjectId, ref : 'User', required: [true, 'UserID is required'] },
    course:                 { type: Schema.Types.ObjectId, ref: 'Course', required: [true, 'CourseID is required'] },
    engagementLevel:        { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    practicalValue:         { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    instructorQuality:      { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    difficultyLevel:        { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    comment:                { type: String, default: '' },
    hasCompleted:           { type: Boolean },
    date:                   { type: Date, default: Date.now }
});

// Virtual field for calculating average rating
reviewSchema.virtual('averageRating').get(function () {
    return (roundToNearestHalf((this.engagementLevel + this.practicalValue + this.instructorQuality + this.difficultyLevel)/4));
});

// Check so review does not already exist by this user for this course
reviewSchema.index({ user:1, course:1 },{ unique:true });

export default model ('Review', reviewSchema);