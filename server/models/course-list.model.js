import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const courseListSchema = new Schema({
    name:           { type: String, default: 'Untitled List' },
    creationDate:   { type: Date, default: Date.now },
    user:           { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required.'] },
    description:    { type: String, default: '' },
    courses:        [{ type: Schema.Types.ObjectId, ref: 'Course', default: [] }],
});

export default model('CourseList', courseListSchema);