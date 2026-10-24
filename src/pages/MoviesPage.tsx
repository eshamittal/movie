import React, { useState, useEffect } from 'react';
import { Search, Film, ArrowUpDown, MapPin } from 'lucide-react';
import { Movie } from '../types/index.ts';
import { api } from '../services/api.ts';
import { MovieCard } from '../components/MovieCard.tsx';
import { useLocation } from '../context/LocationContext.tsx';

interface MoviesPageProps {
  onSelectMovie: (movie: Movie) => void;
  onBookMovie: (movie: Movie) => void;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({ onSelectMovie, onBookMovie }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'now-showing' | 'upcoming'>('all');
  const [genreFilter, setGenreFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'releaseDate' | 'title'>('rating');
  const [loading, setLoading] = useState(true);
  const { selectedCity, setIsLocationModalOpen } = useLocation();

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Biography', 'Comedy'];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.movies.getAll({
          status: statusFilter === 'all' ? undefined : statusFilter,
          genre: genreFilter,
          language: languageFilter,
          search,
          sort: sortBy,
        });
        setMovies(res.movies || []);
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      load();
    }, 150);

    return () => clearTimeout(timer);
  }, [statusFilter, genreFilter, languageFilter, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore All Movies
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Browse current theatrical runs and upcoming blockbusters
          </p>
        </div>

        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>City: {selectedCity} (Change)</span>
        </button>
      </div>

      {/* Filter and Search Controls Bar in Pastel */}
      <div className="bg-white border border-rose-100/90 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, director..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-rose-400 focus:bg-white font-medium"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-rose-400 focus:bg-white"
            >
              <option value="all">All Release Statuses</option>
              <option value="now-showing">Now Showing</option>
              <option value="upcoming">Coming Soon</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-rose-400 focus:bg-white"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g === 'All' ? 'All Genres' : g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-rose-400 focus:bg-white"
            >
              <option value="rating">Sort by Rating (Highest First)</option>
              <option value="releaseDate">Sort by Release Date (Newest)</option>
              <option value="title">Sort Alphabetically (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-slate-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-rose-100 shadow-xs">
          <Film className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Movies Found</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Try adjusting your search query, genre, or release status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onSelect={onSelectMovie}
              onBook={onBookMovie}
            />
          ))}
        </div>
      )}
    </div>
  );
};
