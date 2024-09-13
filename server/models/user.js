const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const validator = require('validator');

const userSchema = new Schema({
    userID:             { type: Number, unique: true, index: true },
    username:           { type: String, required: true, unique: true, trim: true },
    email:              { type: String, required: true, unique: true, trim: true, validate: {
                            validator: validator.isEmail, message: 'invalid email' } },
    password:           { type: String, required: true },
    photo:              { type: String, default: null },
    interests:          { type: [String], default: [] },
    recommendationList: [{ type: Number, ref: 'Course', default: [] }],
    courseLists:        [{type: Number, ref: 'CourseList', default: []}]
});

// Implementation of incrementing ID with mongoose-sequence
userSchema.plugin(AutoIncrement, {inc_field: 'userID'});

module.exports = model('User', userSchema);