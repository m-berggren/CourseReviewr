import mongoose from 'mongoose';

const { connect, connection} = mongoose;

// Variables
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/courseReviewrDB';


if (!mongoURI) {
    console.error('Missing MONGODB_URI for dropping test database.');
    process.exit(1);
}

// Drop database
connect(mongoURI).catch(function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
});
connection.dropDatabase().then(function () {
    console.log(`Dropped database: ${mongoURI}`);
    process.exit(0);
});
