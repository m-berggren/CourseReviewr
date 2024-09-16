import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const { Schema, model } = mongoose;
const AutoIncrement = AutoIncrementFactory(mongoose);

const courseListSchema = new Schema({
    courseListID:   { type: Number, unique: true, index: true },
    name:           { type: String, default: 'Untitled List' },
    creationDate:   { type: Date, default: Date.now },
    userID:         { type: Number, ref: 'User', required: true },
    description:    { type: String, default: null },
    courses:       [{ type: Number, ref: 'Course', default: [] }],
});

// Implementation of incrementing ID with mongoose-sequence
courseListSchema.plugin(AutoIncrement, {inc_field: 'courseListID'});

export default model('CourseList', courseListSchema);