import { Router } from 'express';
import { requestVerification, getVerificationStatus } from '../controllers/verification.controller';
import { jwtAuth } from '../middleware/auth';

const router = Router();

// Request verification (auto-approve for demo)
router.post('/request', jwtAuth, requestVerification);

// Get current verification status
router.get('/status', jwtAuth, getVerificationStatus);

export default router;

