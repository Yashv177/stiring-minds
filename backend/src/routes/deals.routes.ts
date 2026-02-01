import { Router } from 'express';
import { listDeals, getDeal } from '../controllers/deals.controller';
import { validate } from '../middleware/validate';
import { getDealValidation, listDealsValidation } from '../validations/deals.validation';

const router = Router();

router.get('/', validate(listDealsValidation), listDeals);
router.get('/:id', validate(getDealValidation), getDeal);

export default router;
