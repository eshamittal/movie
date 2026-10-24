import { Request, Response } from 'express';
import { dbStore } from '../data/store.ts';

export async function getTheatres(req: Request, res: Response) {
  try {
    const { city } = req.query;
    let theatres = [...dbStore.theatres];

    if (city && typeof city === 'string' && city !== 'All') {
      theatres = theatres.filter((t) => t.city.toLowerCase() === city.toLowerCase());
    }

    return res.json({
      success: true,
      count: theatres.length,
      theatres,
    });
  } catch (error) {
    console.error('Error fetching theatres:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve theatres.' });
  }
}

export async function getTheatreById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const theatre = dbStore.findTheatreById(id);

    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found.' });
    }

    return res.json({
      success: true,
      theatre,
    });
  } catch (error) {
    console.error('Error fetching theatre details:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve theatre details.' });
  }
}

export async function createTheatre(req: Request, res: Response) {
  try {
    const { name, location, address, city, facilities } = req.body;

    if (!name || !location || !address) {
      return res.status(400).json({
        success: false,
        message: 'Name, location, and address are required.',
      });
    }

    const newTheatre = {
      _id: `th_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      location: location.trim(),
      address: address.trim(),
      city: city || 'Mumbai',
      screens: [
        { screenNumber: 1, screenName: 'Screen 1 (Dolby Atmos)', totalSeats: 72, soundSystem: 'Dolby Atmos' },
        { screenNumber: 2, screenName: 'Screen 2 (4DX)', totalSeats: 72, soundSystem: 'Dolby 7.1' },
      ],
      facilities: Array.isArray(facilities)
        ? facilities
        : ['Dolby Atmos', 'Recliner Loungers', 'Parking Available'],
      createdAt: new Date().toISOString(),
    };

    dbStore.theatres.push(newTheatre);

    return res.status(201).json({
      success: true,
      message: 'Theatre added successfully.',
      theatre: newTheatre,
    });
  } catch (error) {
    console.error('Error creating theatre:', error);
    return res.status(500).json({ success: false, message: 'Failed to add theatre.' });
  }
}

export async function updateTheatre(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const theatreIndex = dbStore.theatres.findIndex((t) => t._id === id);

    if (theatreIndex === -1) {
      return res.status(404).json({ success: false, message: 'Theatre not found.' });
    }

    const current = dbStore.theatres[theatreIndex];
    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    dbStore.theatres[theatreIndex] = updated;

    return res.json({
      success: true,
      message: 'Theatre updated successfully.',
      theatre: updated,
    });
  } catch (error) {
    console.error('Error updating theatre:', error);
    return res.status(500).json({ success: false, message: 'Failed to update theatre.' });
  }
}

export async function deleteTheatre(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const theatreIndex = dbStore.theatres.findIndex((t) => t._id === id);

    if (theatreIndex === -1) {
      return res.status(404).json({ success: false, message: 'Theatre not found.' });
    }

    const deleted = dbStore.theatres.splice(theatreIndex, 1)[0];
    dbStore.shows = dbStore.shows.filter((s) => s.theatreId !== id);

    return res.json({
      success: true,
      message: 'Theatre and related shows removed.',
      theatre: deleted,
    });
  } catch (error) {
    console.error('Error deleting theatre:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete theatre.' });
  }
}
