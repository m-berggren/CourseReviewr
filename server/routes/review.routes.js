import { Router } from 'express';
import controller from '../controllers/review.controller.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';

// Need to include mergeParams: true to mount the reviewRoutes in app.js to where they fit in the API structure
const router = Router({ mergeParams: true });

router.post('/', authenticateJWT, controller.createReview);

router.get('/', controller.getAllReviews);

router.get('/:id', controller.getReview);

router.put('/:id', authenticateJWT, controller.updateReview);

router.patch('/:id', authenticateJWT, controller.patchReview);

router.delete('/', authenticateJWT, requireAdmin, controller.deleteAllReviews);

router.delete('/:id', authenticateJWT, requireAdmin, controller.deleteReview);

export default router;