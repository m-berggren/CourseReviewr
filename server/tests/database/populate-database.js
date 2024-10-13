import mongoose from 'mongoose';
import fs from 'fs';
import Topic from '../../models/topic.model.js';
import Course from '../../models/course.model.js';
import User from '../../models/user.model.js';
import CourseList from '../../models/course-list.model.js';
import Review from '../../models/review.model.js';
import { hashPassword } from '../../utils/password.util.js';

const { connect, connection, disconnect } = mongoose;
const mongoURI = 'mongodb://localhost:27017/courseReviewrDB';

// JSON files
const topics = './data/topics.json';
const courses = './data/courses.json';
const users = './data/users.json';
const courseLists = './data/course-lists.json';
const reviews = './data/reviews.json';

// Helper methods
const parseJson = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const mapIds = (docs, field) => docs.reduce((acc, doc) => {
    acc[doc[field]] = doc._id; // Make sure you're only mapping name to _id
    return acc;
}, {});
const replaceNameWithIds = (data, map, field) => data.map(doc => {
    // Check if the field is an array or a single value
    const isArray = Array.isArray(doc[field]);
    const updatedDoc = {
        ...doc,
        [field]: isArray
            ? doc[field].map(name => {
                const id = map[name];
                if (!id) {
                    console.error(`No ID found for ${field} name: "${name}" in document: ${doc.name}`);
                    return null;
                }
                return id;
            }).filter(Boolean) // Filter out nulls
            : map[doc[field]] || null // Handle single value (e.g., user)
    };

    if (!updatedDoc[field]) {
        console.error(`No ID found for ${field} name: "${doc[field]}" in document: ${doc.name}`);
    }

    return updatedDoc;
});


/** SCRIPT:
 * Step 1: Insert topics to MongoDB, return a map with topic names and ids.
 * Step 2: Parse course data and swap topic names for ids. Insert to MongoDB and return map.
 * Step 3: Parse user data and swap topic names for ids. Insert to MongoDB and return map.
 * Step 4: Parse course-list data and swap user & courses names for ids. Insert and map.
 * Step 5: Parse reviews data and swap user & course names for ids. Insert to MongoDB.
*/

const importData = async () => {
    try {
        await connect(mongoURI);
        await connection.dropDatabase();
        connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        connection.once('open', () => console.log('Connected to MongoDB'));

        console.log('Starting data import process...');

        // Step 1: Create Topics
        console.log('Step 1: Creating Topics...');
        const topicsData = parseJson(topics);
        const topicDocs = await Topic.insertMany(topicsData);
        const topicMap = mapIds(topicDocs, 'name');
        console.log(`Successfully created ${topicDocs.length} topics`);

        // Step 2: Create Courses
        console.log('Step 2: Creating Courses...');
        const coursesData = parseJson(courses);
        const coursesWithIds = replaceNameWithIds(coursesData, topicMap, 'topics');
        const courseDocs = await Course.insertMany(coursesWithIds);
        const courseMap = mapIds(courseDocs, 'name');
        console.log(`Successfully created ${courseDocs.length} courses`);

        // Step 3: Create Users
        console.log('Step 3: Creating Users...');
        const usersData = parseJson(users);
        const usersWithHashedPasswords = await Promise.all(usersData.map(async user => {
            if (user.password) {
                user.password = await hashPassword(user.password); // Hash the password for each user
            }
            return user;
        }));
        const usersWithIds = replaceNameWithIds(usersWithHashedPasswords, topicMap, 'interests');
        const userDocs = await User.insertMany(usersWithIds);
        const userMap = mapIds(userDocs, 'username');
        console.log(`Successfully created ${userDocs.length} users`);

        // Step 4: Create CourseLists
        console.log('Step 4: Creating CourseLists...');
        const courseListsData = parseJson(courseLists);
        const courseListsWithUserIds = replaceNameWithIds(courseListsData, userMap, 'user');
        const courseListsWithIds = replaceNameWithIds(courseListsWithUserIds, courseMap, 'courses');
        const courseListDocs = await CourseList.insertMany(courseListsWithIds);
        console.log(`Successfully created ${courseListDocs.length} course lists`);

        // Step 5: Create Reviews
        console.log('Step 6: Creating Reviews...');
        const reviewsData = parseJson(reviews);
        const reviewsWithUserIds = replaceNameWithIds(reviewsData, userMap, 'user');
        const reviewsWithIds = replaceNameWithIds(reviewsWithUserIds, courseMap, 'course');
        const reviewDocs = await Review.insertMany(reviewsWithIds);
        console.log(`Successfully created ${reviewDocs.length} reviews`);

        console.log('Data import process completed successfully!');
    } catch (error) {
        console.error('Error during data import process:', error);
    } finally {
        console.log('Disconnecting from MongoDB...');
        await disconnect();
        console.log('Disconnected from MongoDB. Import process finished.');
    }
};

importData();