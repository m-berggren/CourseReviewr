import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const courseSchema = new Schema({
    name:           { type: String, required: [true, 'Course name is required'], trim: true },
    topics:         [{ type: Schema.Types.ObjectId, ref: 'Topic', required: [true, 'Topic(s) must be specified'], trim: true }],
    difficulty:     { type: String, required: [true, 'Difficulty level is required'] },
    description:    { type: String, default: '' },
    averageRating:  { type: Number, default: 0 },
    releaseYear:    { type: Number, required: [true, 'Release year is required'], trim: true },
    provider:       { type: String, required: [true, 'Provider is required'], trim: true },
    instructor:     { type: String, default: null },
    certificate:    { type: String, enum: ['Yes', 'No'], default: null },
    accessType:     { type: String, enum: ['Free', 'Paid', 'Enrollment'], default: '' },
    photo:          { type: String, default: '' },
    url:            { type: String, default: '' }
});

export default model('Course', courseSchema);