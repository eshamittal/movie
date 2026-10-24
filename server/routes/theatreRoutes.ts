import { Router } from 'express';
import {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} from '../controllers/theatreController.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

router.get('/', getTheatres);
router.get('/:id', getTheatreById);
router.post('/', requireAdmin, createTheatre);
router.put('/:id', requireAdmin, updateTheatre);
router.delete('/:id', requireAdmin, deleteTheatre);

export default router;
