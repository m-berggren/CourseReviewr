import { Router } from 'express';
import controller from '../controllers/course-list.controller.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.post('/', authenticateJWT, controller.createCourseList);


router.get('/', authenticateJWT, controller.getAllCourseLists);


router.get('/:id', authenticateJWT, controller.getCourseList);

router.put('/:id', authenticateJWT, controller.updateCourseList);

router.patch('/:id', authenticateJWT, controller.patchCourseList);

router.delete('/', authenticateJWT, controller.deleteSingleUserCourseLists);

router.delete('/admin', authenticateJWT, requireAdmin, controller.deleteAllCourseLists);

router.delete('/:id', authenticateJWT, controller.deleteCourseList);

export default router;