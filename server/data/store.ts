import { Booking, Movie, Show, Theatre, User } from '../../src/types/index.ts';
import { initialUsers, initialTheatres, initialMovies, generateShowsList, initialBookings } from './seedData.ts';

// In-memory persistent state holder
class DataStore {
  public users: (User & { passwordHash: string })[] = [...initialUsers];
  public theatres: Theatre[] = [...initialTheatres];
  public movies: Movie[] = [...initialMovies];
  public shows: Show[] = generateShowsList();
  public bookings: Booking[] = [...initialBookings];

  // Concurrency lock for atomic seat reservation
  private reservationLocks = new Map<string, Promise<void>>();

  // Reset/reseed helper for Admin
  public resetData() {
    this.users = [...initialUsers];
    this.theatres = [...initialTheatres];
    this.movies = [...initialMovies];
    this.shows = generateShowsList();
    this.bookings = [...initialBookings];
  }

  // Atomic seat reservation runner
  public async withShowLock<T>(showId: string, fn: () => Promise<T>): Promise<T> {
    const existingLock = this.reservationLocks.get(showId) || Promise.resolve();
    let releaseLock: () => void = () => {};
    const newLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    this.reservationLocks.set(showId, existingLock.then(() => newLock));

    try {
      await existingLock;
      return await fn();
    } finally {
      releaseLock();
      if (this.reservationLocks.get(showId) === newLock) {
        this.reservationLocks.delete(showId);
      }
    }
  }

  // Helpers
  public findUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    return this.users.find((u) => u._id === id);
  }

  public findMovieById(id: string) {
    return this.movies.find((m) => m._id === id);
  }

  public findTheatreById(id: string) {
    return this.theatres.find((t) => t._id === id);
  }

  public findShowById(id: string) {
    return this.shows.find((s) => s._id === id);
  }

  public getEnrichedShow(showId: string) {
    const show = this.findShowById(showId);
    if (!show) return null;
    const movie = this.findMovieById(show.movieId);
    const theatre = this.findTheatreById(show.theatreId);
    return {
      ...show,
      movie,
      theatre,
    };
  }

  public getEnrichedBooking(bookingId: string) {
    const booking = this.bookings.find((b) => b._id === bookingId);
    if (!booking) return null;
    const movie = this.findMovieById(booking.movieId);
    const theatre = this.findTheatreById(booking.theatreId);
    const show = this.findShowById(booking.showId);
    const user = this.findUserById(booking.userId);
    return {
      ...booking,
      movie,
      theatre,
      show,
      user: user ? { name: user.name, email: user.email } : undefined,
    };
  }
}

export const dbStore = new DataStore();
