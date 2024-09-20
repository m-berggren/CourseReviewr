import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const { Schema, model } = mongoose;
const AutoIncrement = AutoIncrementFactory(mongoose);

const reviewSchema = new Schema({
    reviewID:               { type: Number, unique: true, index: true },
    user:                   { type: Number, ref : 'User', required: [true, 'UserID is required'] },
    course:                 { type: Number, ref: 'Course', required: [true, 'CourseID is required'] },
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
    return (( this.engagementLevel + this.practicalValue + this.instructorQuality + this.difficultyLevel )/4 );
});

reviewSchema.index({user:1, course:1},{unique:true});

// Implementation of incrementing ID with mongoose-sequence
reviewSchema.plugin(AutoIncrement, {inc_field: 'reviewID'});

export default model ('Review', reviewSchema);