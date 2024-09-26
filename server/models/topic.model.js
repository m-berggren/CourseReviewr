import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const topicSchema = new Schema({
    name: {type: String, required: [true, 'Name is required'], trim: true},
    counter: {type: Number, default: 1}
});

export default model('Topic', topicSchema);

