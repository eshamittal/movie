import { Response } from 'express';
import { dbStore } from '../data/store.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { Booking, SeatTier } from '../../src/types/index.ts';

// Helper to determine tier and price based on row
function getSeatPricing(row: string, pricing: { VIP: number; Premium: number; Standard: number }) {
  if (row === 'A' || row === 'B') {
    return { tier: 'VIP' as const, price: pricing.VIP };
  } else if (row === 'C' || row === 'D' || row === 'E') {
    return { tier: 'Premium' as const, price: pricing.Premium };
  } else {
    return { tier: 'Standard' as const, price: pricing.Standard };
  }
}

export async function createBooking(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to book tickets.' });
    }

    const { showId, selectedSeats, paymentMethod } = req.body;

    if (!showId || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: showId and an array of selectedSeats are required.',
      });
    }

    if (selectedSeats.length > 8) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 8 tickets can be booked per transaction.',
      });
    }

    // Execute atomic reservation using show lock to prevent race conditions & double-booking
    const bookingResult = await dbStore.withShowLock(showId, async () => {
      const show = dbStore.findShowById(showId);
      if (!show) {
        return { error: { status: 404, message: 'The requested show was not found or has ended.' } };
      }

      if (show.status === 'cancelled') {
        return { error: { status: 400, message: 'This show has been cancelled by the cinema.' } };
      }

      const bookedSet = new Set(show.bookedSeats || []);
      const blockedSet = new Set(show.blockedSeats || []);

      // Check if ANY requested seat is already booked or blocked
      const conflictingSeats: string[] = [];
      for (const seatId of selectedSeats) {
        if (bookedSet.has(seatId) || blockedSet.has(seatId)) {
          conflictingSeats.push(seatId);
        }
      }

      if (conflictingSeats.length > 0) {
        return {
          error: {
            status: 409, // HTTP 409 Conflict
            message: `Seat(s) ${conflictingSeats.join(', ')} are already booked or unavailable. Please choose alternative seats.`,
            conflictingSeats,
          },
        };
      }

      // Calculate server-side prices (NEVER TRUST CLIENT TOTALS)
      const seatDetails: { seatId: string; tier: 'VIP' | 'Premium' | 'Standard'; price: number }[] = [];
      let subtotal = 0;

      for (const seatId of selectedSeats) {
        const row = seatId.charAt(0).toUpperCase();
        const { tier, price } = getSeatPricing(row, show.pricing);
        seatDetails.push({ seatId, tier, price });
        subtotal += price;
      }

      const convenienceFee = selectedSeats.length * 25; // 25 per ticket
      const tax = Math.round(subtotal * 0.05); // 5% GST / Entertainment tax
      const totalAmount = subtotal + convenienceFee + tax;

      // Atomically mark seats as booked
      show.bookedSeats.push(...selectedSeats);

      // Generate unique booking reference (e.g. IMV-648192)
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      const bookingReference = `IMV-${randomCode}`;
      const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBooking: Booking = {
        _id: `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        bookingReference,
        userId: req.user!._id,
        showId: show._id,
        movieId: show.movieId,
        theatreId: show.theatreId,
        selectedSeats,
        seatDetails,
        numberOfTickets: selectedSeats.length,
        subtotal,
        convenienceFee,
        tax,
        totalAmount,
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: paymentMethod || 'Credit Card (Simulated)',
        transactionId,
        bookedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      dbStore.bookings.unshift(newBooking);

      return { booking: newBooking };
    });

    if (bookingResult.error) {
      return res.status(bookingResult.error.status).json({
        success: false,
        message: bookingResult.error.message,
        conflictingSeats: (bookingResult.error as any).conflictingSeats,
      });
    }

    const enriched = dbStore.getEnrichedBooking(bookingResult.booking!._id);

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: enriched,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Server error while processing booking.' });
  }
}

export async function getMyBookings(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userBookings = dbStore.bookings
      .filter((b) => b.userId === req.user!._id)
      .map((b) => dbStore.getEnrichedBooking(b._id))
      .filter(Boolean);

    // Sort by bookedAt descending
    userBookings.sort((a, b) => new Date(b!.bookedAt).getTime() - new Date(a!.bookedAt).getTime());

    return res.json({
      success: true,
      count: userBookings.length,
      bookings: userBookings,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
}

export async function getBookingById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const booking = dbStore.getEnrichedBooking(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Security check: Only the owner or an admin may view the booking
    if (booking.userId !== req.user?._id && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied to this booking.' });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve booking.' });
  }
}

export async function cancelBooking(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { id } = req.params;
    const booking = dbStore.bookings.find((b) => b._id === id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Security check: Only owner or admin can cancel
    if (booking.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    // Atomically release seats in show
    await dbStore.withShowLock(booking.showId, async () => {
      const show = dbStore.findShowById(booking.showId);
      if (show) {
        // Remove cancelled seats from bookedSeats
        const seatSet = new Set(booking.selectedSeats);
        show.bookedSeats = show.bookedSeats.filter((seatId) => !seatSet.has(seatId));
      }

      booking.bookingStatus = 'cancelled';
      booking.paymentStatus = 'refunded';
      booking.cancelledAt = new Date().toISOString();
      // Refund subtotal (convenience fee retained as per cinema policy)
      booking.refundAmount = booking.subtotal;
    });

    const enriched = dbStore.getEnrichedBooking(booking._id);

    return res.json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released and refund processed.',
      booking: enriched,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
}
