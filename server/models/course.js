const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const courseSchema = new Schema({
    courseID: {
        type: String,
        default: uuidv4,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: [String],
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null
    },
    averageRating: {
        type: Number,
        default: null
    },
    releaseYear: {
        type: Number,
        required: true,
        trim: true
    },
    provider: {
        type: String,
        required: true,
        trim: true
    },
    certificate: {
        type: String,
        default: null
    },
    availability: {
        type: String,
        default: null
    },
    reviews: [{
        type: Number,
        ref: 'Review',
        default: []
    }],
    photo: {
        type: String,
        default: null
    }
});

module.exports = model('Course', courseSchema);