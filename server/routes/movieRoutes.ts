import { Router } from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', requireAdmin, createMovie);
router.put('/:id', requireAdmin, updateMovie);
router.delete('/:id', requireAdmin, deleteMovie);

export default router;
