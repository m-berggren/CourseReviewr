import Topic from '../models/topic.model.js';
import { handleError } from '../utils/error.util.js';
import { formatName } from '../utils/formatter.util.js';

const createTopic = async (req, res, next) => {
    try {
        const name = formatName(req.body.name);
        
        const existingTopic = await Topic.findOne({ name });

        if (existingTopic) {
            existingTopic.counter += 1;
            await existingTopic.save();

            return res.status(200).json({
                message: `Topic ${name} already exist, counter incremented`,
                topic: existingTopic
            });
        }
        // If doesn't exist then create one
        const newTopic = new Topic({ name });
        await newTopic.save();
        
        res.status(201).json({ topic: newTopic });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const getAllTopics = async (req, res, next) => {
    try {
        const topics = await Topic.find();

        res.status(200).json({ topics });

    } catch (error) {
        next(error);
    }
};

const getTopic = async (req, res, next) => {
    try {
        const id = req.params.id;
        const topic = await Topic.findById(id);

        if (!topic) {
            return res.status(404).json({ message: 'topic not found.' });
        }

        res.status(200).json({ topic });

    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const deleteAllTopics = async (req, res, next) => {
    try {
        const topics = await Topic.deleteMany();

        if (topics.deletedCount === 0) {
            return res.status(404).json({ message: 'No topics found to delete.'});
        }

        return res.status(200).json({ message: `${topics.deletedCount} topics deleted successfully.` });
    } catch (error) {
        next(error);
    }
};

const deleteTopic = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedtopic = await Topic.findByIdAndDelete(id);

        if (!deletedtopic) {
            return res.status(404).json({ message: 'topic not found.' });
        }

        res.status(200).json(deletedtopic);

    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const controller = {
    createTopic,
    getAllTopics,
    getTopic,
    deleteAllTopics,
    deleteTopic
};

export default controller;
