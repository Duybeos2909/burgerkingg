import { Router } from 'express';
import { z } from 'zod';
import { getCart, addToCart, updateCart, clearCart } from '../controllers/cart.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const addSchema = z.object({
  menu_item_id: z.number().int().positive(),
  qty: z.number().int().positive(),
});

const updateSchema = z.object({
  menu_item_id: z.number().int().positive(),
  qty: z.number().int().min(0),
});

router.use(requireAuth);
router.get('/', getCart);
router.post('/add', validate(addSchema), addToCart);
router.patch('/update', validate(updateSchema), updateCart);
router.delete('/clear', clearCart);

export default router;
