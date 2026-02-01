import { Router } from 'express';
import { createClaim, listUserClaims } from '../controllers/claims.controller';
import { jwtAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createClaimValidation, paginationValidation } from '../validations/claims.validation';

const router = Router();

router.post('/', jwtAuth, validate(createClaimValidation), createClaim);
router.get('/me', jwtAuth, validate(paginationValidation), listUserClaims);

export default router;
