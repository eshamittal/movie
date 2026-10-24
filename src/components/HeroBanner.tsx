import React, { useState, useEffect } from 'react';
import { Star, Clock, Play, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/index.ts';

interface HeroBannerProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onBookMovie: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movies, onSelectMovie, onBookMovie }) => {
  const featuredMovies = movies.filter((m) => m.featured || m.status === 'now-showing').slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerModal, setTrailerModal] = useState<string | null>(null);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;

  const current = featuredMovies[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <>
      <div className="relative w-full h-[500px] lg:h-[580px] bg-[#F8F9FC] overflow-hidden select-none border-b border-rose-100/60">
        {/* Background Image with Pastel Gradients */}
        <div className="absolute inset-0">
          <img
            src={current.bannerUrl || current.posterUrl}
            alt={current.title}
            className="w-full h-full object-cover object-center filter opacity-40 scale-102 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FC] via-[#F8F9FC]/70 to-[#F8F9FC]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FC] via-[#F8F9FC]/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl space-y-4 md:space-y-5 pt-8">
            {/* Pastel Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-100 text-rose-800 border border-rose-200 shadow-xs">
                Featured Premiere
              </span>
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center gap-1 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {current.rating > 0 ? `${current.rating}/10` : 'Upcoming'}
              </span>
              <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/80 flex items-center gap-1 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                {Math.floor(current.duration / 60)}h {current.duration % 60}m
              </span>
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200/80 shadow-xs">
                {current.certification || 'U/A'}
              </span>
            </div>

            {/* Title in Deep Slate */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none drop-shadow-xs">
              {current.title}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold text-rose-700">
              {current.genre.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-200/70"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
              {current.description}
            </p>

            {/* Cast */}
            <p className="text-xs text-slate-500">
              <span className="text-slate-700 font-bold">Starring:</span>{' '}
              {current.cast.slice(0, 4).join(', ')}
            </p>

            {/* Pastel Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onBookMovie(current)}
                className="px-6 py-3 rounded-2xl font-black text-xs sm:text-sm text-slate-900 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 hover:from-rose-500 hover:to-amber-400 shadow-sm flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-slate-900" />
                <span>Book Tickets</span>
              </button>

              {current.trailerUrl && (
                <button
                  onClick={() => setTrailerModal(current.trailerUrl || null)}
                  className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-800 bg-white/95 hover:bg-white border border-slate-200 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <button
                onClick={() => onSelectMovie(current)}
                className="px-3.5 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                More Details &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Controls in Pastel */}
        <div className="absolute bottom-6 right-6 sm:right-12 flex items-center gap-2 z-20">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-rose-400' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setTrailerModal(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700 cursor-pointer"
            >
              ✕
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`${trailerModal}?autoplay=1`}
                title="Movie Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
