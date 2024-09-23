import { Router } from 'express';
import controller from '../controllers/course.controller.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateJWT, controller.createCourse);

router.get('/', controller.getAllCourses);

router.get('/:id', controller.getCourse);

router.put('/:id', authenticateJWT, controller.updateCourse);

router.patch('/:id', authenticateJWT, controller.patchCourse);

router.delete('/', authenticateJWT, requireAdmin, controller.deleteAllCourses);

router.delete('/:id', authenticateJWT, requireAdmin, controller.deleteCourse);

export default router;