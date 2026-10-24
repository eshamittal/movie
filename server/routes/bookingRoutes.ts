import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/bookingController.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/my', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);
router.patch('/:id/cancel', requireAuth, cancelBooking);

export default router;
