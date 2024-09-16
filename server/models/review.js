import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const { Schema, model } = mongoose;
const AutoIncrement = AutoIncrementFactory(mongoose);

const reviewSchema = new Schema({
    reviewID:       { type: Number, unique: true, index: true},
    user:           { type:Number, ref : 'User', required: true},
    course:         { type: Number, ref: 'Course', required: true },
    rating:         [{ type: Number, required: true, min : 1, max: 5}],
    date:           { type: Date, default: Date.now },
    comment:        { type: String, default: ''},
    hasCompleted:   { type: Boolean}
});

reviewSchema.index({user:1, course:1},{unique:true});

// Implementation of incrementing ID with mongoose-sequence
reviewSchema.plugin(AutoIncrement, {inc_field: 'reviewID'});

export default model ('Review', reviewSchema);