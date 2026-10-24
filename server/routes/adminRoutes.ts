import { Router } from 'express';
import {
  getDashboardStats,
  getAllBookings,
  toggleSeatBlock,
  resetDatabase,
  getAllUsers,
} from '../controllers/adminController.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

// Protect all admin routes
router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);
router.post('/shows/:showId/toggle-seat', toggleSeatBlock);
router.post('/reset', resetDatabase);

export default router;
