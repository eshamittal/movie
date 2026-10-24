import { Request, Response } from 'express';
import { dbStore } from '../data/store.ts';

export async function getMovies(req: Request, res: Response) {
  try {
    const { status, search, genre, language, sort } = req.query;

    let movies = [...dbStore.movies];

    if (status && (status === 'now-showing' || status === 'upcoming')) {
      movies = movies.filter((m) => m.status === status);
    }

    if (genre && typeof genre === 'string' && genre !== 'All') {
      movies = movies.filter((m) =>
        m.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    if (language && typeof language === 'string' && language !== 'All') {
      movies = movies.filter(
        (m) => m.language.toLowerCase() === language.toLowerCase()
      );
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      movies = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((c) => c.toLowerCase().includes(q)) ||
          m.genre.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (sort) {
      if (sort === 'rating') {
        movies.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'releaseDate') {
        movies.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      } else if (sort === 'title') {
        movies.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    return res.json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve movies.' });
  }
}

export async function getMovieById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const movie = dbStore.findMovieById(id);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    // Attach upcoming shows for this movie
    const shows = dbStore.shows
      .filter((s) => s.movieId === id)
      .map((s) => ({
        ...s,
        theatre: dbStore.findTheatreById(s.theatreId),
      }));

    return res.json({
      success: true,
      movie,
      shows,
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve movie details.' });
  }
}

export async function createMovie(req: Request, res: Response) {
  try {
    const {
      title,
      description,
      genre,
      language,
      duration,
      releaseDate,
      posterUrl,
      bannerUrl,
      cast,
      director,
      rating,
      certification,
      trailerUrl,
      status,
      featured,
    } = req.body;

    if (!title || !description || !posterUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and posterUrl are required fields.',
      });
    }

    const newMovie = {
      _id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      genre: Array.isArray(genre) ? genre : typeof genre === 'string' ? genre.split(',').map((s) => s.trim()) : ['Action'],
      language: language || 'English',
      duration: Number(duration) || 120,
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      posterUrl,
      bannerUrl: bannerUrl || posterUrl,
      cast: Array.isArray(cast) ? cast : typeof cast === 'string' ? cast.split(',').map((s) => s.trim()) : [],
      director: director || 'Director',
      rating: Number(rating) || 0,
      votesCount: 0,
      certification: certification || 'U/A',
      trailerUrl: trailerUrl || '',
      status: status === 'upcoming' ? ('upcoming' as const) : ('now-showing' as const),
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    dbStore.movies.unshift(newMovie);

    return res.status(201).json({
      success: true,
      message: 'Movie created successfully.',
      movie: newMovie,
    });
  } catch (error) {
    console.error('Error creating movie:', error);
    return res.status(500).json({ success: false, message: 'Failed to create movie.' });
  }
}

export async function updateMovie(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const movieIndex = dbStore.movies.findIndex((m) => m._id === id);

    if (movieIndex === -1) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    const current = dbStore.movies[movieIndex];
    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    if (req.body.genre && typeof req.body.genre === 'string') {
      updated.genre = req.body.genre.split(',').map((s: string) => s.trim());
    }
    if (req.body.cast && typeof req.body.cast === 'string') {
      updated.cast = req.body.cast.split(',').map((s: string) => s.trim());
    }

    dbStore.movies[movieIndex] = updated;

    return res.json({
      success: true,
      message: 'Movie updated successfully.',
      movie: updated,
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    return res.status(500).json({ success: false, message: 'Failed to update movie.' });
  }
}

export async function deleteMovie(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const movieIndex = dbStore.movies.findIndex((m) => m._id === id);

    if (movieIndex === -1) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    // Remove movie
    const deleted = dbStore.movies.splice(movieIndex, 1)[0];

    // Cancel related future shows
    dbStore.shows = dbStore.shows.filter((s) => s.movieId !== id);

    return res.json({
      success: true,
      message: 'Movie and associated shows removed successfully.',
      movie: deleted,
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete movie.' });
  }
}
