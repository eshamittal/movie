import React, { useState, useEffect } from 'react';
import { Search, Film, Flame, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Movie } from '../types/index.ts';
import { api } from '../services/api.ts';
import { HeroBanner } from '../components/HeroBanner.tsx';
import { MovieCard } from '../components/MovieCard.tsx';
import { useLocation } from '../context/LocationContext.tsx';

interface HomePageProps {
  onSelectMovie: (movie: Movie) => void;
  onBookMovie: (movie: Movie) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectMovie,
  onBookMovie,
  searchQuery,
  setSearchQuery,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedCity, setIsLocationModalOpen } = useLocation();

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Biography', 'Comedy'];

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const res = await api.movies.getAll();
        setMovies(res.movies || []);
      } catch (err) {
        console.error('Failed to load movies for home:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  // Filter movies
  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cast.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGenre = selectedGenre === 'All' || m.genre.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  const nowShowing = filteredMovies.filter((m) => m.status === 'now-showing');
  const upcoming = filteredMovies.filter((m) => m.status === 'upcoming');

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Showcase Carousel in Pastel */}
      {!searchQuery && movies.length > 0 && (
        <HeroBanner
          movies={movies}
          onSelectMovie={onSelectMovie}
          onBookMovie={onBookMovie}
        />
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Search & Genre Filter Toolbar in Pastel */}
        <div className="bg-white border border-rose-100/90 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search titles, directors, cast..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-rose-400 focus:bg-white placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Location indicator & Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              title="Click to change location"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{selectedCity}</span>
            </button>

            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-gradient-to-r from-rose-400 to-amber-300 text-slate-900 shadow-2xs font-black'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-rose-50/50'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Now Showing in Theatres */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-rose-100/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Now Showing in Cinemas
                </h2>
                <p className="text-xs text-slate-500">
                  Top trending films playing across {selectedCity} auditoriums
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">{nowShowing.length} Movies</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-slate-200 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : nowShowing.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-rose-100 shadow-xs">
              <Film className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No now-showing movies match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {nowShowing.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onSelect={onSelectMovie}
                  onBook={onBookMovie}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Coming Soon / Upcoming */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-rose-100/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Upcoming Releases
                </h2>
                <p className="text-xs text-slate-500">
                  Anticipated theatrical releases hitting screens soon
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">{upcoming.length} Movies</span>
          </div>

          {upcoming.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {upcoming.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onSelect={onSelectMovie}
                  onBook={onBookMovie}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
