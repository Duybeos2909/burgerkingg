import { Router } from 'express';
import { getCategories, getMenu, getMenuItem } from '../controllers/menu.controller.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/', getMenu);
router.get('/:id', getMenuItem);

export default router;
