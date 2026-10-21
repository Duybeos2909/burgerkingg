import { Router } from 'express';
import { z } from 'zod';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orders.controller.js';
import { attachUserIfPresent, requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const orderSchema = z.object({
  items: z.array(z.object({
    menu_item_id: z.number().int().positive(),
    name: z.string().optional(),
    price: z.number().optional(),
    qty: z.number().int().positive(),
  })).min(1),
  order_type: z.enum(['pickup', 'delivery']).default('pickup'),
  store_id: z.number().int().positive(),
  promo_code: z.string().trim().optional().or(z.literal('')),
  guest_email: z.string().trim().email().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.order_type === 'delivery' && !data.guest_email) {
    return;
  }
});

const statusSchema = z.object({
  status: z.enum(['pending', 'preparing', 'ready', 'completed', 'cancelled']),
});

router.post('/', attachUserIfPresent, validate(orderSchema), createOrder);
router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderById);
router.patch('/:id/status', requireAuth, requireAdmin, validate(statusSchema), updateOrderStatus);

export default router;
