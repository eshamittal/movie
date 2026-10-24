import React, { useState } from 'react';
import { Film, X, Save, AlertCircle } from 'lucide-react';
import { Movie } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AdminMovieModalProps {
  movie?: Movie | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminMovieModal: React.FC<AdminMovieModalProps> = ({ movie, onSuccess, onClose }) => {
  const [title, setTitle] = useState(movie?.title || '');
  const [description, setDescription] = useState(movie?.description || '');
  const [genre, setGenre] = useState(movie?.genre.join(', ') || 'Action, Sci-Fi');
  const [language, setLanguage] = useState(movie?.language || 'English');
  const [duration, setDuration] = useState(movie?.duration ? String(movie.duration) : '145');
  const [releaseDate, setReleaseDate] = useState(movie?.releaseDate || new Date().toISOString().split('T')[0]);
  const [posterUrl, setPosterUrl] = useState(movie?.posterUrl || '');
  const [bannerUrl, setBannerUrl] = useState(movie?.bannerUrl || '');
  const [director, setDirector] = useState(movie?.director || '');
  const [cast, setCast] = useState(movie?.cast.join(', ') || '');
  const [rating, setRating] = useState(movie?.rating ? String(movie.rating) : '8.5');
  const [certification, setCertification] = useState(movie?.certification || 'U/A');
  const [trailerUrl, setTrailerUrl] = useState(movie?.trailerUrl || '');
  const [status, setStatus] = useState<'now-showing' | 'upcoming'>(movie?.status || 'now-showing');
  const [featured, setFeatured] = useState<boolean>(movie?.featured || false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      title,
      description,
      genre: genre.split(',').map((s) => s.trim()).filter(Boolean),
      language,
      duration: Number(duration),
      releaseDate,
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      bannerUrl: bannerUrl || posterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      director,
      cast: cast.split(',').map((s) => s.trim()).filter(Boolean),
      rating: Number(rating),
      certification,
      trailerUrl,
      status,
      featured,
    };

    try {
      if (movie?._id) {
        await api.movies.update(movie._id, payload);
      } else {
        await api.movies.create(payload);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save movie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-rose-100 rounded-3xl shadow-2xl overflow-hidden my-6">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/70 to-amber-50/50">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-extrabold text-slate-800">
              {movie ? 'Edit Movie Details' : 'Add New Cinema Movie'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Director *</label>
              <input
                type="text"
                required
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Synopsis / Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Genres (comma separated)</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (mins)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Poster Image URL</label>
              <input
                type="url"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Backdrop URL</label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cast (comma separated)</label>
            <input
              type="text"
              value={cast}
              onChange={(e) => setCast(e.target.value)}
              placeholder="Actor 1, Actor 2..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (0-10)</label>
              <input
                type="number"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              >
                <option value="now-showing">Now Showing</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Certification</label>
              <input
                type="text"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                placeholder="U/A 16+"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured-check"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-rose-500 bg-slate-100 border-slate-300"
            />
            <label htmlFor="featured-check" className="text-xs font-medium text-slate-700">
              Highlight in Hero Banner Showcase
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-extrabold text-slate-900 bg-gradient-to-r from-rose-400 to-amber-300 hover:from-rose-500 hover:to-amber-400 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{movie ? 'Save Changes' : 'Create Movie'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
