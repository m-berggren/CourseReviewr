const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reviewSchema = new Schema({
    reviewID: { type: String, default: uuidv4, unique: true, index: true},
    user: {type:String, ref : 'User', required: true},
    course: {type: String, ref: 'Course', required: true },
    rating: {type: Number, required: true, min : 1, max: 5},
    date: {type: Date, default: Date.now },
    comment: {type: String},
    hasCompleted: {type: Boolean}
});

reviewSchema.index({user:1, course:1},{unique:true});

module.exports = model ('Review', reviewSchema);