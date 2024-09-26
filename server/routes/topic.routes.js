import { Router } from 'express';
import controller from '../controllers/topic.controller.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateJWT, controller.createTopic);

router.get('/', controller.getAllTopics);

router.get('/:id', controller.getTopic);

router.delete('/', authenticateJWT, requireAdmin, controller.deleteAllTopics);

router.delete('/:id', authenticateJWT, controller.deleteTopic);

export default router;