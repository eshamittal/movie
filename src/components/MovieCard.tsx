import React from 'react';
import { Star, Clock, Ticket } from 'lucide-react';
import { Movie } from '../types/index.ts';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onBook: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect, onBook }) => {
  const isNowShowing = movie.status === 'now-showing';

  return (
    <div className="group relative bg-white border border-rose-100/80 rounded-3xl overflow-hidden hover:border-rose-300 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 flex flex-col">
      {/* Poster Container */}
      <div
        onClick={() => onSelect(movie)}
        className="relative aspect-[2/3] w-full overflow-hidden cursor-pointer bg-slate-100"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-xs ${
              isNowShowing
                ? 'bg-white/95 text-rose-700 border border-rose-200'
                : 'bg-white/95 text-amber-800 border border-amber-200'
            }`}
          >
            {isNowShowing ? 'Now Showing' : 'Coming Soon'}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-700 border border-slate-200 backdrop-blur-md w-fit shadow-xs">
            {movie.language}
          </span>
        </div>

        {/* Rating Badge */}
        {movie.rating > 0 ? (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-xl bg-white/95 border border-amber-200 text-amber-900 text-xs font-black flex items-center gap-1 backdrop-blur-md shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-xl bg-white/95 border border-slate-200 text-slate-700 text-[10px] font-bold backdrop-blur-md shadow-xs">
            Upcoming
          </div>
        )}

        {/* Duration & Certification Bottom Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="flex items-center gap-1 text-[11px] font-bold bg-slate-900/70 px-2 py-0.5 rounded-lg backdrop-blur-sm">
            <Clock className="w-3 h-3 text-slate-300" />
            {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
          </span>
          <span className="text-[11px] font-bold bg-slate-900/70 px-2 py-0.5 rounded-lg border border-white/20 backdrop-blur-sm">
            {movie.certification || 'U/A'}
          </span>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          <h3
            onClick={() => onSelect(movie)}
            className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 cursor-pointer"
            title={movie.title}
          >
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-1 mt-1.5">
            {movie.genre.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-100"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {isNowShowing ? (
            <button
              onClick={() => onBook(movie)}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-black text-slate-900 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 hover:from-rose-500 hover:to-amber-400 shadow-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Tickets</span>
            </button>
          ) : (
            <button
              onClick={() => onSelect(movie)}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-center cursor-pointer"
            >
              View Preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
