import React, { useState, useEffect } from 'react';
import { Building, MapPin, Sparkles, Volume2, Film } from 'lucide-react';
import { Theatre } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useLocation } from '../context/LocationContext.tsx';

interface TheatresPageProps {
  onSelectMovieForBooking: () => void;
}

export const TheatresPage: React.FC<TheatresPageProps> = ({ onSelectMovieForBooking }) => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const { selectedCity, setSelectedCity, setIsLocationModalOpen } = useLocation();
  const [loading, setLoading] = useState<boolean>(true);

  const cities = ['All', 'Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad'];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.theatres.getAll(selectedCity === 'All' ? undefined : selectedCity);
        setTheatres(res.theatres || []);
      } catch (err) {
        console.error('Failed to load theatres:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cinema Multiplexes & Theatres
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Experience world-class projection in IMAX Laser 3D, Dolby Atmos, and 4DX auditoriums
          </p>
        </div>

        {/* Change City Action Button */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>City: {selectedCity} (Change)</span>
        </button>
      </div>

      {/* City Filter Pills in Pastel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedCity === city
                ? 'bg-gradient-to-r from-rose-400 to-amber-300 text-slate-900 shadow-2xs font-black'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Theatres Grid in Pastel */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 bg-slate-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : theatres.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-rose-100 shadow-xs">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Theatres Found in {selectedCity}</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
            Try switching to another city like Mumbai, Bangalore, or Delhi NCR.
          </p>
          <button
            onClick={() => setSelectedCity('Mumbai')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-rose-400 to-amber-300 shadow-xs cursor-pointer"
          >
            Switch to Mumbai
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              className="bg-white border border-rose-100/90 rounded-3xl p-6 sm:p-7 space-y-5 hover:border-rose-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    {theatre.city}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    {theatre.screens.length} Auditoriums
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900">{theatre.name}</h3>

                <p className="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{theatre.address}</span>
                </p>
              </div>

              {/* Screens and Sound Systems */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Auditoriums & Sound Systems
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {theatre.screens.map((screen) => (
                    <div
                      key={screen.screenNumber}
                      className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-0.5"
                    >
                      <strong className="text-slate-800 block text-xs font-bold">{screen.screenName}</strong>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Volume2 className="w-3 h-3 text-amber-500" />
                        {screen.soundSystem}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities in Pastel */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Theatre Amenities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {theatre.facilities.map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-xl bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={onSelectMovieForBooking}
                  className="w-full py-2.5 px-4 rounded-2xl text-xs font-black text-slate-800 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5 text-rose-500" />
                  <span>View Movies Playing Here</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
