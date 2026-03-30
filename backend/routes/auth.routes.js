import { Router } from 'express';
import { z } from 'zod';
import { register, login, me, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

const registerSchema = z.object({
  first_name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8),
  dob: z.string().trim().optional().or(z.literal('')),
  postcode: z.string().trim().optional().or(z.literal('')),
  marketing_emails: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.get('/me', requireAuth, me);
router.post('/logout', logout);

export default router;
