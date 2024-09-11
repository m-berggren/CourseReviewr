const {Schema, model} = require('mongoose');
const {v4:uuidv4} = require('uuid');
const validator = require('validator');

const userSchema = new Schema({
    userID: { 
        type: String,
        default: uuidv4,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'invalid email'
        }
    },
    password: {
        type: String,
        required: true
    },
    interests: {
        type: [String],
        default: []
    },
    recommendationList: [{
        type: Number,
        ref: 'Course',
        default: []
    }],
    courseList: [{ 
        type: Number,
        ref: "courseList",
        default: [],
    }]
});

module.exports = model('User', userSchema);