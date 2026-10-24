import React, { useState, useEffect } from 'react';
import { Star, Clock, Calendar, Play, Ticket, ArrowLeft, MapPin } from 'lucide-react';
import { Movie, Show, Theatre } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ShowtimeSelector } from '../components/ShowtimeSelector.tsx';
import { useLocation } from '../context/LocationContext.tsx';

interface MovieDetailsPageProps {
  movie: Movie;
  onBack: () => void;
  onSelectShow: (show: Show) => void;
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({
  movie,
  onBack,
  onSelectShow,
}) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [trailerModal, setTrailerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { selectedCity, setIsLocationModalOpen } = useLocation();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [showsRes, theatresRes] = await Promise.all([
          api.shows.getAll({ movieId: movie._id }),
          api.theatres.getAll(),
        ]);
        setShows(showsRes.shows || []);
        setTheatres(theatresRes.theatres || []);
      } catch (err) {
        console.error('Failed to load movie details data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [movie._id]);

  const isNowShowing = movie.status === 'now-showing';

  return (
    <div className="space-y-10 pb-16">
      {/* Top Banner & Movie Overview in Pastel */}
      <div className="relative w-full min-h-[460px] bg-[#F8F9FC] overflow-hidden border-b border-rose-100">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center filter opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FC] via-[#F8F9FC]/80 to-[#F8F9FC]/40" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Movies</span>
            </button>

            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-800 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>City: {selectedCity}</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            {/* Poster Card */}
            <div className="w-52 sm:w-64 aspect-[2/3] rounded-3xl overflow-hidden shadow-xl border border-rose-100 flex-shrink-0 bg-white">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Column */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                  {isNowShowing ? 'Now Showing' : 'Coming Soon'}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {movie.language}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {movie.certification || 'U/A'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {movie.title}
              </h1>

              {/* Rating & Duration Bar */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-600">
                {movie.rating > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-amber-900 font-extrabold shadow-2xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>{movie.rating.toFixed(1)} / 10</span>
                    {movie.votesCount ? (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({movie.votesCount.toLocaleString()} votes)
                      </span>
                    ) : null}
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1 rounded-xl text-sky-900 font-bold">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl text-slate-700 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Released {movie.releaseDate}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-800"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <div className="space-y-1 max-w-2xl">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Synopsis</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Director & Cast Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div>
                  <span className="text-slate-400 block font-bold">Director:</span>
                  <span className="text-slate-800 font-semibold">{movie.director}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Starring Cast:</span>
                  <span className="text-slate-800 font-semibold">{movie.cast.join(', ')}</span>
                </div>
              </div>

              {/* Actions in Pastel */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {movie.trailerUrl && (
                  <button
                    onClick={() => setTrailerModal(true)}
                    className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <Play className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span>Watch Official Trailer</span>
                  </button>
                )}

                {isNowShowing && (
                  <a
                    href="#theatre-schedules"
                    className="px-6 py-3 rounded-2xl text-xs font-black text-slate-900 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 hover:from-rose-500 hover:to-amber-400 shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Ticket className="w-4 h-4 text-slate-900" />
                    <span>View Showtimes Below</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theatres & Showtimes Section in Pastel */}
      <div id="theatre-schedules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-100 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Theatrical Showtimes & Screenings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose your preferred cinema hall, screen format, and showtime to pick seats.
            </p>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Multiplexes in {selectedCity}</span>
          </button>
        </div>

        {isNowShowing ? (
          <ShowtimeSelector
            shows={shows}
            theatres={theatres}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onSelectShow={onSelectShow}
          />
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-rose-100 shadow-xs">
            <Calendar className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Coming Soon to Cinemas</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto">
              Advance booking for {movie.title} has not opened yet. Check back closer to the release date ({movie.releaseDate}).
            </p>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {trailerModal && movie.trailerUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setTrailerModal(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700 cursor-pointer"
            >
              ✕
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`${movie.trailerUrl}?autoplay=1`}
                title={`${movie.title} Official Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
