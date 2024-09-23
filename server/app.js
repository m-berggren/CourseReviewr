import express, { urlencoded, json, static as eStatic } from 'express';
import { connect } from 'mongoose';
import morgan from 'morgan';
import history from 'connect-history-api-fallback';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { normalize, join } from 'path';
import cors from 'cors';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import methodOverride from 'method-override';

import userRoutes from './controllers/users.js';
import courseRoutes from './controllers/courses.js';
import reviewRoutes from './controllers/reviews.js';
import courseListRoutes from './controllers/course-lists.js';
import authRoutes from './controllers/auth.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/courseRadarDB';
var port = process.env.PORT || 3000;

// Create default admin if no users exist
const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({role: 'admin'});
        if (!adminExists) {
            const adminPassword = 'admin123';
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const adminUser = new User({
                username: 'admin',
                email: 'admin@courseradar.com',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Default admin user created', adminPassword);
        } else {
            console.log ('Admin user already exists, skipping default admin creation');
        }
    }catch(error){
        console.error('Error checking or creating admin user:', error);
    }
};

// Connect to MongoDB
connect(mongoURI).catch(function(err) {
    console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
    console.error(err.stack);
    process.exit(1);
}).then(function() {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`); // mistake when forward porting
    createDefaultAdmin();
});



// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(urlencoded({ extended: true }));
app.use(json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors());

//HTTP method overwriting
app.use(methodOverride('_method')); 

// Import routes
app.get('/api', function(req, res) {
    res.json({'message': 'Welcome to your DIT342 backend ExpressJS project!'});
});

//API versioning
const api = '/api/v1';

// Controller routes - important to have the longer urls first
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/courses/:courseID/reviews`, reviewRoutes);
app.use(`${api}/users/:userID/courses/:courseID/reviews`, reviewRoutes);
app.use(`${api}/users/:userID/reviews`, reviewRoutes);
app.use(`${api}/users/:userID/course-lists`, courseListRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/courses`, courseRoutes);
app.use(`${api}/reviews`, reviewRoutes);


// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = normalize(__dirname + '/..');
var client = join(root, 'client', 'dist');
app.use(eStatic(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});

export default app;
