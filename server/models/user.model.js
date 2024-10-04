import mongoose from 'mongoose';
import validator from 'validator';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: [true, 'Username is required'], unique: true, trim: true },
    email: {
        type: String, required: [true, 'Email is required'], unique: true, trim: true, validate: {
            validator: validator.isEmail, message: 'invalid email'
        }
    },
    password: { type: String, required: [true, 'Password is required'] },
    //photo:              { data: Buffer, contentType: String },
    photo: { type: String, default: null },
    interests: {
        type: [Schema.Types.ObjectId], ref: 'Topic', default: [],
        set: v => Array.from(new Set(v.map(interest => interest.toString())))
    },
    recommendationList: [{ type: Schema.Types.ObjectId, ref: 'Course', default: [] }],
    courseLists: [{ type: Schema.Types.ObjectId, ref: 'CourseList', default: [] }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

export default model('User', userSchema);