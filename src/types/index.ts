export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number; // in minutes
  releaseDate: string;
  posterUrl: string;
  bannerUrl: string;
  cast: string[];
  director: string;
  rating: number; // e.g. 8.6
  votesCount?: number;
  certification?: string; // U/A 13+, R, PG-13
  trailerUrl?: string;
  status: 'now-showing' | 'upcoming';
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Theatre {
  _id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  screens: {
    screenNumber: number;
    screenName: string;
    totalSeats: number;
    soundSystem: string; // Dolby Atmos, IMAX 12.1
  }[];
  facilities: string[]; // Parking, Food Court, Wheelchair Access, Recliner Seats
  createdAt?: string;
  updatedAt?: string;
}

export type SeatTier = 'VIP' | 'Premium' | 'Standard';

export interface Seat {
  id: string; // e.g. "A1", "C5"
  row: string; // "A"
  number: number; // 1
  tier: SeatTier;
  price: number;
  status: 'available' | 'selected' | 'booked' | 'blocked';
}

export interface Show {
  _id: string;
  movieId: string;
  movie?: Movie;
  theatreId: string;
  theatre?: Theatre;
  screenNumber: number;
  format: '2D' | '3D' | 'IMAX 3D' | '4DX' | 'Dolby Cinema';
  showDate: string; // YYYY-MM-DD
  startTime: string; // "14:30"
  endTime?: string;
  basePrice: number;
  pricing: {
    VIP: number;
    Premium: number;
    Standard: number;
  };
  totalSeats: number;
  bookedSeats: string[]; // array of seat IDs like ["A1", "A2"]
  blockedSeats: string[];
  status: 'scheduled' | 'running' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  bookingReference: string; // e.g. "IMV-849102"
  userId: string;
  user?: {
    name: string;
    email: string;
  };
  showId: string;
  show?: Show;
  movieId: string;
  movie?: Movie;
  theatreId: string;
  theatre?: Theatre;
  selectedSeats: string[]; // ["A1", "A2"]
  seatDetails: {
    seatId: string;
    tier: SeatTier;
    price: number;
  }[];
  numberOfTickets: number;
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  bookingStatus: 'confirmed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string; // "Credit Card", "UPI", "Net Banking"
  transactionId?: string;
  bookedAt: string;
  cancelledAt?: string;
  refundAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  totalMovies: number;
  totalTheatres: number;
  activeShowsCount: number;
  recentBookings: Booking[];
  popularMovies: {
    movie: Movie;
    ticketsSold: number;
    revenue: number;
  }[];
}
