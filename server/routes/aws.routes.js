import { Router } from 'express';
import awsController from '../controllers/aws.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/generate-upload-url', authenticateJWT, awsController.generateUploadUrl);
router.get('/generate-download-url', awsController.generateDownloadUrl);

export default router;