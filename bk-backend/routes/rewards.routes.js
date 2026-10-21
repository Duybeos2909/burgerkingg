import { Router } from 'express';
import { z } from 'zod';
import { getRewardsCatalogue, getRewardsProfile, redeemReward } from '../controllers/rewards.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const redeemSchema = z.object({
  reward_id: z.number().int().positive(),
});

router.get('/catalogue', getRewardsCatalogue);
router.get('/profile', requireAuth, getRewardsProfile);
router.post('/redeem', requireAuth, validate(redeemSchema), redeemReward);

export default router;
