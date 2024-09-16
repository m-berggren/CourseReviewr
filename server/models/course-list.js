const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

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

module.exports = model('CourseList', courseListSchema);