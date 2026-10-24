import React, { useState } from 'react';
import { MapPin, Navigation, Search, Check, X, Sparkles, Building2 } from 'lucide-react';
import { useLocation, AVAILABLE_CITIES } from '../context/LocationContext.tsx';

export const LocationModal: React.FC = () => {
  const {
    selectedCity,
    setSelectedCity,
    isLocationModalOpen,
    setIsLocationModalOpen,
    detectUserLocation,
    isDetecting,
    locationStatus,
  } = useLocation();

  const [search, setSearch] = useState('');

  if (!isLocationModalOpen) return null;

  const popularCities = AVAILABLE_CITIES.filter((c) => c.popular);
  const filteredCities = AVAILABLE_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white border border-rose-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-50/70 via-pink-50/50 to-amber-50/40 border-b border-rose-100/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Select Cinema Location</h3>
              <p className="text-xs text-slate-500">Pick your city to discover local multiplexes and shows</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & GPS Action Bar */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your city..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
              />
            </div>

            {/* GPS Auto-Detect Button */}
            <button
              onClick={detectUserLocation}
              disabled={isDetecting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              title="Automatically detect closest city via browser GPS"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin text-rose-600' : ''}`} />
              <span>{isDetecting ? 'Detecting GPS...' : 'Auto-Detect City'}</span>
            </button>
          </div>

          {locationStatus && (
            <p className="text-xs text-rose-600 bg-rose-50/80 px-3 py-1.5 rounded-lg border border-rose-100">
              {locationStatus}
            </p>
          )}

          {/* Popular Cities Grid */}
          {!search && (
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Popular Cinema Hubs
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {popularCities.map((city) => {
                  const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city.name)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group ${
                        isSelected
                          ? 'bg-rose-100/70 border-rose-400 text-rose-900 shadow-sm ring-1 ring-rose-300'
                          : 'bg-slate-50/80 hover:bg-rose-50/50 border-slate-200 hover:border-rose-200 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold">{city.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {city.theatresCount} Multiplexes
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Cities List */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {search ? 'Search Results' : 'Other Regional Cities'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.name)}
                    className={`p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="block font-medium">{city.name}</span>
                      <span className="text-[10px] text-slate-500">{city.state}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-center text-xs text-slate-500">
          Showing cinema multiplexes, IMAX auditoriums, and showtimes for{' '}
          <strong className="text-rose-600">{selectedCity}</strong>
        </div>
      </div>
    </div>
  );
};
