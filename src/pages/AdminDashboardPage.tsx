import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Ticket,
  Film,
  Building,
  Calendar,
  Users,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { DashboardStats, Movie, Show, Theatre, Booking, User } from '../types/index.ts';
import { api } from '../services/api.ts';
import { AdminMovieModal } from '../components/AdminMovieModal.tsx';
import { AdminShowModal } from '../components/AdminShowModal.tsx';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [activeTab, setActiveTab] = useState<'kpi' | 'movies' | 'shows' | 'bookings' | 'users'>('kpi');
  const [loading, setLoading] = useState(true);

  // Modals
  const [editingMovie, setEditingMovie] = useState<Movie | null | undefined>(undefined);
  const [showModalOpen, setShowModalOpen] = useState(false);

  // Filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, theatresRes, showsRes, bookingsRes, usersRes] = await Promise.all([
        api.admin.getStats(),
        api.movies.getAll(),
        api.theatres.getAll(),
        api.shows.getAll(),
        api.admin.getAllBookings(),
        api.admin.getUsers(),
      ]);

      setStats(statsRes.stats);
      setMovies(moviesRes.movies || []);
      setTheatres(theatresRes.theatres || []);
      setShows(showsRes.shows || []);
      setBookings(bookingsRes.bookings || []);
      setUsers(usersRes.users || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDeleteMovie = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the movie "${title}" and its scheduled shows?`)) {
      return;
    }
    try {
      await api.movies.delete(id);
      await fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete movie.');
    }
  };

  const handleDeleteShow = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel and delete this showtime?')) {
      return;
    }
    try {
      await api.shows.delete(id);
      await fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete show.');
    }
  };

  const handleToggleSeatBlock = async (showId: string, seatId: string) => {
    try {
      await api.admin.toggleSeatBlock(showId, seatId);
      await fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle seat state.');
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset all cinema data (movies, theatres, shows, bookings) back to default initial state?')) {
      return;
    }
    try {
      await api.admin.resetDatabase();
      await fetchAllData();
      alert('Database successfully re-seeded!');
    } catch (err: any) {
      alert(err.message || 'Failed to reset database.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingStatusFilter === 'all' || b.bookingStatus === bookingStatusFilter;
    const matchesSearch =
      !bookingSearch ||
      b.bookingReference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.user?.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.movie?.title.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-rose-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
              Administrator Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Cinema Operations & Management
          </h1>
          <p className="text-xs text-slate-500">
            Real-time box office analytics, catalogue governance, and inventory controls
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDatabase}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Reset database to initial pristine seed data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Reseed Database</span>
          </button>
        </div>
      </div>

      {/* Tabs in Pastel */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'kpi', label: 'Overview & KPIs', icon: TrendingUp },
          { id: 'movies', label: `Movies (${movies.length})`, icon: Film },
          { id: 'shows', label: `Shows & Seats (${shows.length})`, icon: Calendar },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Ticket },
          { id: 'users', label: `Users (${users.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'kpi' && stats && (
        <div className="space-y-8">
          {/* 4 Primary Pastel KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-5 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="text-3xl font-black text-amber-950 font-mono">
                ₹{stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-amber-700/80 font-medium">Confirmed ticket reservations</p>
            </div>

            <div className="bg-rose-50/80 border border-rose-200/80 rounded-3xl p-5 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                Total Bookings
              </span>
              <div className="text-3xl font-black text-rose-950 font-mono">
                {stats.totalBookings}
              </div>
              <p className="text-[11px] text-rose-700/80 font-medium">Lifetime transactions logged</p>
            </div>

            <div className="bg-sky-50/80 border border-sky-200/80 rounded-3xl p-5 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                Theatrical Movies
              </span>
              <div className="text-3xl font-black text-sky-950 font-mono">
                {stats.totalMovies}
              </div>
              <p className="text-[11px] text-sky-700/80 font-medium">Now showing & coming soon</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-3xl p-5 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Active Theatres
              </span>
              <div className="text-3xl font-black text-emerald-950 font-mono">
                {stats.totalTheatres}
              </div>
              <p className="text-[11px] text-emerald-700/80 font-medium">IMAX, 4DX, and Dolby halls</p>
            </div>
          </div>

          {/* Popular Movies by Tickets Sold */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900">Top Performing Movies</h3>
            <div className="space-y-3">
              {stats.popularMovies.map(({ movie, ticketsSold, revenue }, idx) => (
                <div
                  key={movie._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-xl border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{movie.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{movie.genre.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-700 font-mono block">
                      ₹{revenue.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{ticketsSold} tickets sold</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MOVIES MANAGEMENT */}
      {activeTab === 'movies' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Movie Catalogue Management</h3>
            <button
              onClick={() => setEditingMovie(null)}
              className="px-4 py-2 rounded-2xl text-xs font-black text-slate-900 bg-gradient-to-r from-rose-400 to-amber-300 hover:from-rose-500 hover:to-amber-400 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Movie</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="bg-white border border-rose-100 rounded-3xl p-4 flex gap-4 items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-14 aspect-[2/3] object-cover rounded-xl border border-slate-200"
                  />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{movie.title}</h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {movie.status}
                    </span>
                    <p className="text-[11px] text-slate-500">Rating: ⭐ {movie.rating}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setEditingMovie(movie)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Edit Movie"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(movie._id, movie.title)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                    title="Delete Movie"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SHOWS & SEAT MANAGEMENT */}
      {activeTab === 'shows' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Showtimes & Seat Override Controls</h3>
            <button
              onClick={() => setShowModalOpen(true)}
              className="px-4 py-2 rounded-2xl text-xs font-black text-slate-900 bg-gradient-to-r from-amber-300 to-rose-400 hover:from-amber-400 hover:to-rose-500 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Show</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-3xl bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Movie</th>
                  <th className="p-3">Theatre & Screen</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Occupancy</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {shows.map((show) => {
                  const booked = show.bookedSeats?.length || 0;
                  const blocked = show.blockedSeats?.length || 0;

                  return (
                    <tr key={show._id} className="hover:bg-rose-50/30">
                      <td className="p-3 font-bold text-slate-900">{show.movie?.title}</td>
                      <td className="p-3 text-slate-500">
                        {show.theatre?.name} (Audi {show.screenNumber})
                      </td>
                      <td className="p-3 font-mono">
                        {show.showDate} at {show.startTime}
                      </td>
                      <td className="p-3 font-bold text-rose-700">{show.format}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{booked}/{show.totalSeats} booked</span>
                          {blocked > 0 && (
                            <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded-md font-mono">
                              {blocked} blocked
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 flex items-center gap-2">
                        <button
                          onClick={() => handleToggleSeatBlock(show._id, 'A1')}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 cursor-pointer"
                          title="Toggle seat A1 blocked state"
                        >
                          Toggle A1
                        </button>
                        <button
                          onClick={() => handleDeleteShow(show._id)}
                          className="p-1 rounded text-red-500 hover:text-red-700 cursor-pointer"
                          title="Cancel Show"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BOOKINGS AUDIT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <h3 className="text-base font-extrabold text-slate-900">All User Ticket Transactions</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search reference, email..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="px-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs w-full sm:w-48"
              />
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-3xl bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Movie & Theatre</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-rose-50/30">
                    <td className="p-3 font-mono font-bold text-rose-700">{b.bookingReference}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{b.user?.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{b.user?.email}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{b.movie?.title}</div>
                      <div className="text-[10px] text-slate-500">{b.theatre?.name}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-800">
                      {b.selectedSeats.join(', ')}
                    </td>
                    <td className="p-3 font-mono font-black text-slate-900">₹{b.totalAmount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Registered Users & Roles</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-3xl bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-rose-50/30">
                    <td className="p-3 font-mono text-slate-400 text-[11px]">{u._id}</td>
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 font-mono">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {editingMovie !== undefined && (
        <AdminMovieModal
          movie={editingMovie}
          onSuccess={() => {
            setEditingMovie(undefined);
            fetchAllData();
          }}
          onClose={() => setEditingMovie(undefined)}
        />
      )}

      {showModalOpen && (
        <AdminShowModal
          movies={movies}
          theatres={theatres}
          onSuccess={() => {
            setShowModalOpen(false);
            fetchAllData();
          }}
          onClose={() => setShowModalOpen(false)}
        />
      )}
    </div>
  );
};
