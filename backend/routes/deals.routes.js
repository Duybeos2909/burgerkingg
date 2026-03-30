import { Router } from 'express';
import { z } from 'zod';
import { getDeals, validateDeal } from '../controllers/deals.controller.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const validateDealSchema = z.object({
  promo_code: z.string().trim().min(1),
  subtotal: z.number().nonnegative(),
});

router.get('/', getDeals);
router.post('/validate', validate(validateDealSchema), validateDeal);

export default router;
