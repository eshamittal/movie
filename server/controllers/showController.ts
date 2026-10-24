import { Request, Response } from 'express';
import { dbStore } from '../data/store.ts';

// Helper to generate a full 72-seat layout with VIP, Premium, Standard tiers
export function generateShowSeatMap(show: any) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 9;
  const seats = [];

  const bookedSet = new Set(show.bookedSeats || []);
  const blockedSet = new Set(show.blockedSeats || []);

  for (const row of rows) {
    let tier: 'VIP' | 'Premium' | 'Standard' = 'Standard';
    let price = show.pricing?.Standard || show.basePrice || 220;

    if (row === 'A' || row === 'B') {
      tier = 'VIP';
      price = show.pricing?.VIP || (show.basePrice + 160) || 450;
    } else if (row === 'C' || row === 'D' || row === 'E') {
      tier = 'Premium';
      price = show.pricing?.Premium || (show.basePrice + 60) || 320;
    }

    for (let num = 1; num <= seatsPerRow; num++) {
      const seatId = `${row}${num}`;
      let status: 'available' | 'booked' | 'blocked' = 'available';

      if (bookedSet.has(seatId)) {
        status = 'booked';
      } else if (blockedSet.has(seatId)) {
        status = 'blocked';
      }

      seats.push({
        id: seatId,
        row,
        number: num,
        tier,
        price,
        status,
      });
    }
  }

  return seats;
}

export async function getShows(req: Request, res: Response) {
  try {
    const { movieId, theatreId, showDate } = req.query;

    let shows = [...dbStore.shows];

    if (movieId && typeof movieId === 'string') {
      shows = shows.filter((s) => s.movieId === movieId);
    }

    if (theatreId && typeof theatreId === 'string') {
      shows = shows.filter((s) => s.theatreId === theatreId);
    }

    if (showDate && typeof showDate === 'string') {
      shows = shows.filter((s) => s.showDate === showDate);
    }

    // Enrich shows with movie and theatre
    const enriched = shows.map((s) => ({
      ...s,
      movie: dbStore.findMovieById(s.movieId),
      theatre: dbStore.findTheatreById(s.theatreId),
      availableSeatsCount: s.totalSeats - (s.bookedSeats?.length || 0) - (s.blockedSeats?.length || 0),
    }));

    return res.json({
      success: true,
      count: enriched.length,
      shows: enriched,
    });
  } catch (error) {
    console.error('Error fetching shows:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve shows.' });
  }
}

export async function getShowById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const show = dbStore.getEnrichedShow(id);

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    const availableSeatsCount =
      show.totalSeats - (show.bookedSeats?.length || 0) - (show.blockedSeats?.length || 0);

    return res.json({
      success: true,
      show: {
        ...show,
        availableSeatsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching show:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve show.' });
  }
}

export async function getShowSeats(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const show = dbStore.getEnrichedShow(id);

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    const seats = generateShowSeatMap(show);

    return res.json({
      success: true,
      showId: show._id,
      format: show.format,
      pricing: show.pricing,
      totalSeats: show.totalSeats,
      bookedCount: show.bookedSeats.length,
      availableCount: seats.filter((s) => s.status === 'available').length,
      seats,
    });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve seats.' });
  }
}

export async function createShow(req: Request, res: Response) {
  try {
    const {
      movieId,
      theatreId,
      screenNumber,
      format,
      showDate,
      startTime,
      endTime,
      basePrice,
      pricing,
    } = req.body;

    if (!movieId || !theatreId || !showDate || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Movie, theatre, showDate, and startTime are required.',
      });
    }

    const parsedBase = Number(basePrice) || 250;
    const newShow = {
      _id: `shw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      movieId,
      theatreId,
      screenNumber: Number(screenNumber) || 1,
      format: format || '2D',
      showDate,
      startTime,
      endTime: endTime || '3h',
      basePrice: parsedBase,
      pricing: pricing || {
        VIP: parsedBase + 160,
        Premium: parsedBase + 60,
        Standard: parsedBase,
      },
      totalSeats: 72,
      bookedSeats: [],
      blockedSeats: [],
      status: 'scheduled' as const,
      createdAt: new Date().toISOString(),
    };

    dbStore.shows.push(newShow);

    return res.status(201).json({
      success: true,
      message: 'Show scheduled successfully.',
      show: newShow,
    });
  } catch (error) {
    console.error('Error creating show:', error);
    return res.status(500).json({ success: false, message: 'Failed to schedule show.' });
  }
}

export async function updateShow(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const showIndex = dbStore.shows.findIndex((s) => s._id === id);

    if (showIndex === -1) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    const current = dbStore.shows[showIndex];
    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    dbStore.shows[showIndex] = updated;

    return res.json({
      success: true,
      message: 'Show updated successfully.',
      show: updated,
    });
  } catch (error) {
    console.error('Error updating show:', error);
    return res.status(500).json({ success: false, message: 'Failed to update show.' });
  }
}

export async function deleteShow(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const showIndex = dbStore.shows.findIndex((s) => s._id === id);

    if (showIndex === -1) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    const deleted = dbStore.shows.splice(showIndex, 1)[0];

    return res.json({
      success: true,
      message: 'Show deleted successfully.',
      show: deleted,
    });
  } catch (error) {
    console.error('Error deleting show:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete show.' });
  }
}
