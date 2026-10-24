import { Request, Response } from 'express';
import { dbStore } from '../data/store.ts';

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const totalRevenue = dbStore.bookings
      .filter((b) => b.bookingStatus === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalBookings = dbStore.bookings.length;
    const totalUsers = dbStore.users.length;
    const totalMovies = dbStore.movies.length;
    const totalTheatres = dbStore.theatres.length;
    const activeShowsCount = dbStore.shows.filter((s) => s.status === 'scheduled').length;

    // Recent 10 bookings
    const recentBookings = dbStore.bookings
      .slice(0, 10)
      .map((b) => dbStore.getEnrichedBooking(b._id))
      .filter(Boolean);

    // Popular movies computation
    const movieStatsMap = new Map<string, { ticketsSold: number; revenue: number }>();
    for (const b of dbStore.bookings) {
      if (b.bookingStatus === 'confirmed') {
        const current = movieStatsMap.get(b.movieId) || { ticketsSold: 0, revenue: 0 };
        current.ticketsSold += b.numberOfTickets;
        current.revenue += b.totalAmount;
        movieStatsMap.set(b.movieId, current);
      }
    }

    const popularMovies = dbStore.movies
      .map((m) => {
        const stats = movieStatsMap.get(m._id) || { ticketsSold: 0, revenue: 0 };
        return {
          movie: m,
          ticketsSold: stats.ticketsSold,
          revenue: stats.revenue,
        };
      })
      .sort((a, b) => b.ticketsSold - a.ticketsSold)
      .slice(0, 5);

    return res.json({
      success: true,
      stats: {
        totalRevenue,
        totalBookings,
        totalUsers,
        totalMovies,
        totalTheatres,
        activeShowsCount,
        recentBookings,
        popularMovies,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve stats.' });
  }
}

export async function getAllBookings(req: Request, res: Response) {
  try {
    const { status, search } = req.query;

    let bookings = dbStore.bookings.map((b) => dbStore.getEnrichedBooking(b._id)).filter(Boolean);

    if (status && typeof status === 'string' && status !== 'all') {
      bookings = bookings.filter((b) => b!.bookingStatus === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      bookings = bookings.filter(
        (b) =>
          b!.bookingReference.toLowerCase().includes(q) ||
          b!.user?.name.toLowerCase().includes(q) ||
          b!.user?.email.toLowerCase().includes(q) ||
          b!.movie?.title.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
}

export async function toggleSeatBlock(req: Request, res: Response) {
  try {
    const { showId } = req.params;
    const { seatId } = req.body;

    if (!showId || !seatId) {
      return res.status(400).json({ success: false, message: 'showId and seatId are required.' });
    }

    const show = dbStore.findShowById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    const blockedSet = new Set(show.blockedSeats || []);
    let isBlocked = false;

    if (blockedSet.has(seatId)) {
      show.blockedSeats = show.blockedSeats.filter((s) => s !== seatId);
      isBlocked = false;
    } else {
      show.blockedSeats.push(seatId);
      isBlocked = true;
    }

    return res.json({
      success: true,
      message: `Seat ${seatId} ${isBlocked ? 'blocked' : 'unblocked'} successfully.`,
      blockedSeats: show.blockedSeats,
    });
  } catch (error) {
    console.error('Error toggling seat block:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle seat status.' });
  }
}

export async function resetDatabase(req: Request, res: Response) {
  try {
    dbStore.resetData();
    return res.json({
      success: true,
      message: 'Database reseeded successfully to pristine initial state.',
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset database.' });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = dbStore.users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
}
