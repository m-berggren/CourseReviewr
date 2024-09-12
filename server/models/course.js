const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const courseSchema = new Schema({
    courseID: {
        type: Number,
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
    instructor: {
        type: String,
        default: null
    },
    certificate: {
        type: String,
        default: null
    },
    accessType: {
        type: String,
        default: null
    },
    photo: {
        type: String,
        default: null
    },
    url: {
        type: String,
        default: null
    }
});

// Implementation of incrementing courseID with mongoose-sequence
courseSchema.plugin(AutoIncrement, {inc_field: 'courseID'});

module.exports = model('Course', courseSchema);