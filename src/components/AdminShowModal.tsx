import React, { useState } from 'react';
import { Calendar, X, Save, AlertCircle } from 'lucide-react';
import { Movie, Show, Theatre } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AdminShowModalProps {
  movies: Movie[];
  theatres: Theatre[];
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminShowModal: React.FC<AdminShowModalProps> = ({
  movies,
  theatres,
  onSuccess,
  onClose,
}) => {
  const [movieId, setMovieId] = useState(movies[0]?._id || '');
  const [theatreId, setTheatreId] = useState(theatres[0]?._id || '');
  const [screenNumber, setScreenNumber] = useState('1');
  const [format, setFormat] = useState<'2D' | '3D' | 'IMAX 3D' | '4DX' | 'Dolby Cinema'>('IMAX 3D');
  const [showDate, setShowDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('06:30 PM');
  const [basePrice, setBasePrice] = useState('300');
  const [vipPrice, setVipPrice] = useState('480');
  const [premiumPrice, setPremiumPrice] = useState('360');
  const [standardPrice, setStandardPrice] = useState('260');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await api.shows.create({
        movieId,
        theatreId,
        screenNumber: Number(screenNumber),
        format,
        showDate,
        startTime,
        basePrice: Number(basePrice),
        pricing: {
          VIP: Number(vipPrice),
          Premium: Number(premiumPrice),
          Standard: Number(standardPrice),
        },
      });
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule show.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-rose-100 rounded-3xl shadow-2xl overflow-hidden my-6">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/60 to-rose-50/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-extrabold text-slate-800">Schedule Cinema Showtime</h3>
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Movie *</label>
            <select
              required
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
            >
              {movies.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title} ({m.status === 'now-showing' ? 'Now Showing' : 'Upcoming'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Theatre *</label>
            <select
              required
              value={theatreId}
              onChange={(e) => setTheatreId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
            >
              {theatres.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} - {t.city}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Show Date *</label>
              <input
                type="date"
                required
                value={showDate}
                onChange={(e) => setShowDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time *</label>
              <input
                type="text"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="07:30 PM"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              >
                <option value="IMAX 3D">IMAX 3D</option>
                <option value="Dolby Cinema">Dolby Cinema</option>
                <option value="4DX">4DX</option>
                <option value="3D">3D</option>
                <option value="2D">2D</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Screen / Audi #</label>
              <input
                type="number"
                min={1}
                max={12}
                value={screenNumber}
                onChange={(e) => setScreenNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Pricing Tiers in Pastel */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tiered Ticket Pricing (₹)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-800 block mb-1 font-bold">VIP Lounger</span>
                <input
                  type="number"
                  value={vipPrice}
                  onChange={(e) => setVipPrice(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-white border border-amber-200 text-slate-800 text-xs font-mono font-bold"
                />
              </div>
              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200">
                <span className="text-[10px] text-pink-800 block mb-1 font-bold">Premium</span>
                <input
                  type="number"
                  value={premiumPrice}
                  onChange={(e) => setPremiumPrice(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-white border border-pink-200 text-slate-800 text-xs font-mono font-bold"
                />
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                <span className="text-[10px] text-sky-800 block mb-1 font-bold">Standard</span>
                <input
                  type="number"
                  value={standardPrice}
                  onChange={(e) => setStandardPrice(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-white border border-sky-200 text-slate-800 text-xs font-mono font-bold"
                />
              </div>
            </div>
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
              className="px-5 py-2 rounded-xl text-xs font-black text-slate-900 bg-gradient-to-r from-amber-300 via-pink-300 to-rose-400 hover:from-amber-400 hover:to-rose-500 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Schedule Show</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
