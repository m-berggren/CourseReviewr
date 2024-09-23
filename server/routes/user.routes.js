import { Router } from 'express';
import controller from '../controllers/user.controller.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateJWT, requireAdmin, controller.createUser);

router.get('/', authenticateJWT, requireAdmin, controller.getAllUsers);

router.get('/:id', authenticateJWT, controller.getUser);

router.put('/:id', authenticateJWT, controller.updateUser);

router.patch('/:id', authenticateJWT, controller.patchUser);

router.delete('/', authenticateJWT, requireAdmin, controller.deleteAllUsers);

router.delete('/:id', authenticateJWT, requireAdmin, controller.deleteUser);

export default router;