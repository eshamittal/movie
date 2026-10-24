import {
  AuthResponse,
  Booking,
  DashboardStats,
  Movie,
  Seat,
  Show,
  Theatre,
  User,
} from '../types/index.ts';

const BASE_URL = '/api';

export function getToken(): string | null {
  return localStorage.getItem('imovies_token');
}

export function setToken(token: string) {
  localStorage.setItem('imovies_token', token);
}

export function removeToken() {
  localStorage.removeItem('imovies_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Server communication error' }));

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg) as any;
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (details: { name: string; email: string; password: string }) =>
      request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(details),
      }),
    getMe: () => request<{ success: boolean; user: User }>('/auth/me'),
  },

  movies: {
    getAll: (params?: {
      status?: 'now-showing' | 'upcoming';
      search?: string;
      genre?: string;
      language?: string;
      sort?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.search) query.append('search', params.search);
      if (params?.genre) query.append('genre', params.genre);
      if (params?.language) query.append('language', params.language);
      if (params?.sort) query.append('sort', params.sort);

      return request<{ success: boolean; count: number; movies: Movie[] }>(
        `/movies${query.toString() ? `?${query.toString()}` : ''}`
      );
    },
    getById: (id: string) =>
      request<{ success: boolean; movie: Movie; shows: Show[] }>(`/movies/${id}`),
    create: (movieData: Partial<Movie>) =>
      request<{ success: boolean; message: string; movie: Movie }>('/movies', {
        method: 'POST',
        body: JSON.stringify(movieData),
      }),
    update: (id: string, movieData: Partial<Movie>) =>
      request<{ success: boolean; message: string; movie: Movie }>(`/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(movieData),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/movies/${id}`, {
        method: 'DELETE',
      }),
  },

  theatres: {
    getAll: (city?: string) =>
      request<{ success: boolean; count: number; theatres: Theatre[] }>(
        `/theatres${city ? `?city=${encodeURIComponent(city)}` : ''}`
      ),
    getById: (id: string) =>
      request<{ success: boolean; theatre: Theatre }>(`/theatres/${id}`),
    create: (theatreData: Partial<Theatre>) =>
      request<{ success: boolean; message: string; theatre: Theatre }>('/theatres', {
        method: 'POST',
        body: JSON.stringify(theatreData),
      }),
    update: (id: string, theatreData: Partial<Theatre>) =>
      request<{ success: boolean; message: string; theatre: Theatre }>(`/theatres/${id}`, {
        method: 'PUT',
        body: JSON.stringify(theatreData),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/theatres/${id}`, {
        method: 'DELETE',
      }),
  },

  shows: {
    getAll: (params?: { movieId?: string; theatreId?: string; showDate?: string }) => {
      const query = new URLSearchParams();
      if (params?.movieId) query.append('movieId', params.movieId);
      if (params?.theatreId) query.append('theatreId', params.theatreId);
      if (params?.showDate) query.append('showDate', params.showDate);

      return request<{ success: boolean; count: number; shows: Show[] }>(
        `/shows${query.toString() ? `?${query.toString()}` : ''}`
      );
    },
    getById: (id: string) =>
      request<{ success: boolean; show: Show }>(`/shows/${id}`),
    getSeats: (id: string) =>
      request<{
        success: boolean;
        showId: string;
        format: string;
        pricing: { VIP: number; Premium: number; Standard: number };
        totalSeats: number;
        bookedCount: number;
        availableCount: number;
        seats: Seat[];
      }>(`/shows/${id}/seats`),
    create: (showData: Partial<Show>) =>
      request<{ success: boolean; message: string; show: Show }>('/shows', {
        method: 'POST',
        body: JSON.stringify(showData),
      }),
    update: (id: string, showData: Partial<Show>) =>
      request<{ success: boolean; message: string; show: Show }>(`/shows/${id}`, {
        method: 'PUT',
        body: JSON.stringify(showData),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/shows/${id}`, {
        method: 'DELETE',
      }),
  },

  bookings: {
    create: (data: { showId: string; selectedSeats: string[]; paymentMethod?: string }) =>
      request<{ success: boolean; message: string; booking: Booking }>('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMyBookings: () =>
      request<{ success: boolean; count: number; bookings: Booking[] }>('/bookings/my'),
    getById: (id: string) =>
      request<{ success: boolean; booking: Booking }>(`/bookings/${id}`),
    cancel: (id: string) =>
      request<{ success: boolean; message: string; booking: Booking }>(
        `/bookings/${id}/cancel`,
        {
          method: 'PATCH',
        }
      ),
  },

  admin: {
    getStats: () =>
      request<{ success: boolean; stats: DashboardStats }>('/admin/dashboard'),
    getAllBookings: (params?: { status?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.search) query.append('search', params.search);

      return request<{ success: boolean; count: number; bookings: Booking[] }>(
        `/admin/bookings${query.toString() ? `?${query.toString()}` : ''}`
      );
    },
    toggleSeatBlock: (showId: string, seatId: string) =>
      request<{ success: boolean; message: string; blockedSeats: string[] }>(
        `/admin/shows/${showId}/toggle-seat`,
        {
          method: 'POST',
          body: JSON.stringify({ seatId }),
        }
      ),
    resetDatabase: () =>
      request<{ success: boolean; message: string }>('/admin/reset', {
        method: 'POST',
      }),
    getUsers: () =>
      request<{ success: boolean; count: number; users: User[] }>('/admin/users'),
  },
};
