import { Router } from 'express';
import controller from '../controllers/course.controller.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateJWT, controller.createCourse);

router.get('/', controller.getAllCourses);

router.get('/providers', controller.getAllProviders);

router.get('/:id', controller.getCourse);

router.get('/:id/ratings', controller.getAggregatedRatings);

router.put('/:id', authenticateJWT, controller.updateCourse);

router.patch('/:id', controller.patchCourse);

router.delete('/', authenticateJWT, requireAdmin, controller.deleteAllCourses);

router.delete('/:id', authenticateJWT, requireAdmin, controller.deleteCourse);

export default router;