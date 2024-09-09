import { mongoose } from 'mongoose';

const onlineCourseSchema = new mongoose.Schema({
    courseID: String,
    name: String,
    topic: [ String ],
    difficulty: String,
    description: String,
    averageRating: [ Number ],
    releaseYear: Date,
    provider: String,
    certificate: Boolean,
    availability: String
});

module.exports = mongoose.model('onlineCourse', onlineCourseSchema);