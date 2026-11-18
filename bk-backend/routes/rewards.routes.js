import { Router } from 'express';
import { z } from 'zod';
import {
  getAdminRewardsStatus,
  getRewardsCatalogue,
  getRewardsProfile,
  redeemReward,
  syncExternalOrderPayment,
} from '../controllers/rewards.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const redeemSchema = z.object({
  reward_id: z.number().int().positive(),
});
const externalOrderPaymentSchema = z.object({
  external_order_id: z.string().trim().min(1).max(100),
  customer_email: z.string().trim().email().max(254),
  total_cents: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  paid: z.boolean(),
});

router.get('/catalogue', getRewardsCatalogue);
router.get('/profile', requireAuth, getRewardsProfile);
router.post('/redeem', requireAuth, validate(redeemSchema), redeemReward);
router.get('/admin/status', requireAuth, requireAdmin, getAdminRewardsStatus);
router.post('/admin/order-payment', requireAuth, requireAdmin, validate(externalOrderPaymentSchema), syncExternalOrderPayment);

export default router;
