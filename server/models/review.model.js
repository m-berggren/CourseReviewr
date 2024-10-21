import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    user:               { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'UserID is required'] },
    course:             { type: Schema.Types.ObjectId, ref: 'Course', required: [true, 'CourseID is required'] },
    engagementLevel:    { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    practicalValue:     { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    instructorQuality:  { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    difficultyLevel:    { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    comment:            { type: String, default: '' },
    hasCompleted:       { type: Boolean },
    date:               { type: Date, default: Date.now },
    averageRating:      { type: Number },
    edited:             { type: Date, default: null }
});

// Pre-save hook to compute averageRating before saving the review
reviewSchema.pre('save', function (next) {
    this.averageRating = (this.engagementLevel + this.practicalValue + this.instructorQuality + this.difficultyLevel) / 4;
    next();
});

// Pre-findOneAndUpdate hook to compute averageRating before updating the review
reviewSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.engagementLevel !== undefined || update.practicalValue !== undefined || update.instructorQuality !== undefined || update.difficultyLevel !== undefined) {
        const engagementLevel = update.engagementLevel || this._update.engagementLevel;
        const practicalValue = update.practicalValue || this._update.practicalValue;
        const instructorQuality = update.instructorQuality || this._update.instructorQuality;
        const difficultyLevel = update.difficultyLevel || this._update.difficultyLevel;

        update.averageRating = (engagementLevel + practicalValue + instructorQuality + difficultyLevel) / 4;
    }
    next();
});


// Check so review does not already exist by this user for this course
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

export default model('Review', reviewSchema);