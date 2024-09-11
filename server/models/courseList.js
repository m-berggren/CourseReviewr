const {Schema, model} = require('mongoose');
const {v4: uuidv4} = require('uuid');

const courseListSchema = new Schema({
    courseListID: {type: String, default: uuidv4, unique: true, index: true},
    name: {type: String, default: 'Untitled List'},
    creationDate: {type: Date, default: Date.now},
    userID: {type: String, ref: 'User', required: true},
    description: String,
    courses: [{type: String, ref: 'Course', default: []}],
})

module.exports = model('CourseList', courseListSchema);