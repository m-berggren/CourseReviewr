import CourseList from '../models/course-list.model.js';
import User from '../models/user.model.js';
import { handleError } from '../utils/error.util.js';

const createCourseList = async (req, res, next) => {
    try {
        // Find the user through custom userID
        const userID = req.params.userID;
        const { name, description, courses } = req.body;
        const newCourseList = new CourseList({
            name,
            creationDate: new Date(),
            user: userID,
            description,
            courses
        });
        const savedCourseList = await newCourseList.save();

        // Update the user's courseLists array
        await User.findByIdAndUpdate(
            userID,
            { $push: { courseLists: savedCourseList._id } },
            { new: true }
        );

        res.status(201).json(savedCourseList);
    } catch (error) {
        next(error);
    }
};

const getAllCourseLists = async (req, res, next) => {
    try {
        const user = req.params.userID;
        const courseLists = await CourseList.find({ user }).populate('courses');
        res.status(200).json(courseLists);
    } catch (error) {
        handleError(error, res) || next(error);
    }
};

const getCourseList = async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const id = req.params.id;

        const isAdmin = req.user.role === 'admin';

        const courseList = await CourseList.findById(id).populate('user').populate('courses');
        if (!courseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }

        // Check if the user is an admin or if they are the owner of the CourseList
        if (!isAdmin && courseList.user._id.toString() !== userIdFromToken) {
            return res.status(403).json({ message: 'Forbidden: You can only get your own course list.' });
        }

        res.status(200).json(courseList);
    } catch (error) {
        handleError(error, res) || next(error);
    }
};

const updateCourseList = async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const id = req.params.id;
        const updates = req.body;

        const isAdmin = req.user.role === 'admin';

        // Find the CourseList to check ownership
        const courseList = await CourseList.findById(id);
        if (!courseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }

        // Check if the user is an admin or if they are the owner of the CourseList
        if (!isAdmin && courseList.user._id.toString() !== userIdFromToken) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own course list.' });
        }

        const updatedCourseList = await CourseList.findByIdAndUpdate(
            id,
            { ...updates },
            { new: true, runValidators: true, overwrite: true }
        );

        if (!updatedCourseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }
        res.status(200).json(updatedCourseList);
    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const patchCourseList = async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const id = req.params.id;
        const updates = req.body;
        const removeCourseId = req.body.removeCourseId;

        const isAdmin = req.user.role === 'admin';

        // Find the CourseList to check ownership
        const courseList = await CourseList.findById(id);
        if (!courseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }

        // Check if the user is an admin or if they are the owner of the CourseList
        if (!isAdmin && courseList.user._id.toString() !== userIdFromToken) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own course list.' });
        }

        // Handle removing a course
        if (removeCourseId) {
            await CourseList.findByIdAndUpdate(
                id,
                { $pull: { courses: removeCourseId } },
                { new: true }
            );
        }
        const updatedCourseList = await CourseList.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true });
        if (!updatedCourseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }
        res.status(200).json(updatedCourseList);
    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const deleteSingleUserCourseLists = async (req, res, next) => {
    try {
        const userID = req.params.userID;

        // Find all course lists belonging to the user
        const courseLists = await CourseList.find({ user: userID });

        if (courseLists.length === 0) {
            return res.status(404).json({ message: 'No course-lists found to delete for this user.' });
        }

        // Remove references from the user's courseLists
        await User.findByIdAndUpdate(
            userID,
            { $pull: { courseLists: { $in: courseLists.map(list => list._id) } } }
        );

        // Now delete all course lists belonging to the user
        const deleteResult = await CourseList.deleteMany({ user: userID });

        res.status(200).json({ message: `${deleteResult.deletedCount} course-lists deleted successfully.` });
    } catch (error) {
        next(error);
    }
};

const deleteAllCourseLists = async (req, res, next) => {
    try {
        // First, find all course lists before deletion
        const courseLists = await CourseList.find(); // Get all course lists

        if (courseLists.length === 0) {
            res.status(404).json({ message: 'No course-lists found to delete.' });
        }


        // Remove references from users' courseLists
        await User.updateMany(
            { courseLists: { $in: courseLists.map(list => list._id) } },
            { $pull: { courseLists: { $in: courseLists.map(list => list._id) } } }
        );

        // Now delete all course lists
        const deleteResult = await CourseList.deleteMany();

        res.status(200).json({ message: `${deleteResult.deletedCount} course-lists deleted successfully.` });
    } catch (error) {
        next(error);
    }
};


const deleteCourseList = async (req, res, next) => {
    try {
        const userIdFromToken = req.user.id;
        const id = req.params.id;

        const isAdmin = req.user.role === 'admin';

        // Find the CourseList to check ownership
        const courseList = await CourseList.findById(id);
        if (!courseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }

        // Check if the user is an admin or if they are the owner of the CourseList
        if (!isAdmin && courseList.user._id.toString() !== userIdFromToken) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own course list.' });
        }

        const deletedCourseList = await CourseList.findByIdAndDelete(id);
        if (!deletedCourseList) {
            return res.status(404).json({ message: 'CourseList not found.' });
        }

        // Remove the course list reference from the user's courseLists
        await User.updateMany(
            { courseLists: id },
            { $pull: { courseLists: id } }
        );

        res.status(200).json(deletedCourseList);
    } catch (error) {
        return handleError(error, res) || next(error);
    }
};

const controller = {
    createCourseList,
    getAllCourseLists,
    getCourseList,
    updateCourseList,
    patchCourseList,
    deleteSingleUserCourseLists,
    deleteAllCourseLists,
    deleteCourseList
};

export default controller;