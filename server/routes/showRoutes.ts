import { Router } from 'express';
import {
  getShows,
  getShowById,
  getShowSeats,
  createShow,
  updateShow,
  deleteShow,
} from '../controllers/showController.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

router.get('/', getShows);
router.get('/:id', getShowById);
router.get('/:id/seats', getShowSeats);
router.post('/', requireAdmin, createShow);
router.put('/:id', requireAdmin, updateShow);
router.delete('/:id', requireAdmin, deleteShow);

export default router;
