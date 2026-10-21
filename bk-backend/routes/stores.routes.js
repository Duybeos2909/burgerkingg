import { Router } from 'express';
import { getNearbyStores, getStoreById, getStores } from '../controllers/stores.controller.js';

const router = Router();

router.get('/nearby', getNearbyStores);
router.get('/', getStores);
router.get('/:id', getStoreById);

export default router;
