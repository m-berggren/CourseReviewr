const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: String,
    topic: [ String ],
    difficulty: String,
    description: String,
    averageRating: Number,
    releaseYear: Number,
    provider: String,
    certificate: String,
    availability: String
});

module.exports = mongoose.model('Course', courseSchema);