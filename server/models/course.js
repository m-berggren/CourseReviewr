const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const courseSchema = new Schema({
    courseID: { type: String, default: uuidv4, unique: true, index: true },
    name: String,
    topic: [String],
    difficulty: String,
    description: String,
    averageRating: Number,
    releaseYear: Number,
    provider: String,
    certificate: String,
    availability: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', default: [] }],
    photo: { type: String, default: null }
});

module.exports = model('Course', courseSchema);