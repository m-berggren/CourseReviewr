import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/passport.middleware.js';

const router = Router();

router.post('/register', authController.register);

router.post('/signin', authenticateUser, authController.signin);

export default router;