import { Router } from 'express';
import controller from '../controllers/user.controller.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';
import multer from 'multer';


const router = Router();
// Multer setup for image uploads, store the image in memory as a Buffer
const storage = multer.memoryStorage();
// 'photo' is the field name in the form
const upload = multer({ storage }).single('photo');


router.post('/', authenticateJWT, requireAdmin, controller.createUser);

router.get('/', authenticateJWT, requireAdmin, controller.getAllUsers);

router.get('/:id/reviews', authenticateJWT, controller.getUserReviews);

router.get('/:id', authenticateJWT, controller.getUser);

router.put('/:id', authenticateJWT, controller.updateUser);

router.patch('/:id', authenticateJWT, upload, controller.patchUser);

router.delete('/', authenticateJWT, requireAdmin, controller.deleteAllUsers);

router.delete('/:id', authenticateJWT, requireAdmin, controller.deleteUser);

export default router;