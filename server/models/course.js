import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const { Schema, model } = mongoose;
const AutoIncrement = AutoIncrementFactory(mongoose);

const courseSchema = new Schema({
    courseID:       { type: Number, unique: true, index: true },
    name:           { type: String, required: [true, 'Course name is required'], trim: true },
    topic:          [{ type: String, required: [true, 'Topic(s) must be specified'], trim: true }],
    difficulty:     { type: String, required: [true, 'Difficulty level is required'] },
    description:    { type: String, default: null },
    averageRating:  { type: Number, default: null },
    releaseYear:    { type: Number, required: [true, 'Release year is required'], trim: true },
    provider:       { type: String, required: [true, 'Provider is required'], trim: true },
    instructor:     { type: String, default: null },
    certificate:    { type: String, enum: ['Yes', 'No'], default: null },
    accessType:     { type: String, enum: ['Free', 'Paid', 'Enrollment'], default: null },
    photo:          { type: String, default: null },
    url:            { type: String, default: null }
});

// Implementation of incrementing ID with mongoose-sequence
courseSchema.plugin(AutoIncrement, {inc_field: 'courseID'});

export default model('Course', courseSchema);