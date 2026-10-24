import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Seat, Show } from '../types/index.ts';
import { api } from '../services/api.ts';

interface SeatPickerProps {
  show: Show;
  onProceedToPayment: (selectedSeats: string[], totalAmount: number, subtotal: number, fee: number, tax: number) => void;
  onBack: () => void;
}

export const SeatPicker: React.FC<SeatPickerProps> = ({ show, onProceedToPayment, onBack }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const MAX_SEATS = 8;

  const fetchSeats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.shows.getSeats(show._id);
      setSeats(res.seats);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load live seat layout.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [show._id]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'available') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= MAX_SEATS) {
        setErrorMsg(`You can select a maximum of ${MAX_SEATS} seats per booking.`);
        return;
      }
      setErrorMsg(null);
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  };

  // Compute pricing
  const selectedSeatObjects = seats.filter((s) => selectedSeatIds.includes(s.id));
  const subtotal = selectedSeatObjects.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeatIds.length * 25;
  const tax = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + convenienceFee + tax;

  // Group seats by rows
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsByRow = rowLabels.map((row) => ({
    row,
    seats: seats.filter((s) => s.row === row),
    tier: row === 'A' || row === 'B' ? 'VIP' : row === 'C' || row === 'D' || row === 'E' ? 'Premium' : 'Standard',
  }));

  return (
    <div className="bg-white border border-rose-100/90 rounded-3xl p-4 sm:p-8 max-w-5xl mx-auto shadow-sm space-y-8">
      {/* Header with Show Summary in Pastel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 mb-2 flex items-center gap-1 transition-colors cursor-pointer"
          >
            &larr; Back to Showtimes
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>{show.movie?.title}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
              {show.format}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {show.theatre?.name} &bull; Screen {show.screenNumber} &bull; {show.showDate} at {show.startTime}
          </p>
        </div>

        <button
          onClick={() => fetchSeats(true)}
          disabled={refreshing}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Refresh current seat availability from server"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-rose-500' : ''}`} />
          <span>Sync Seats</span>
        </button>
      </div>

      {/* Screen Graphic in Soft Pastel Gradient */}
      <div className="relative w-full max-w-2xl mx-auto pt-2 pb-6 text-center">
        <div className="relative h-12 flex items-center justify-center">
          <svg className="w-full h-12 overflow-visible" viewBox="0 0 500 40">
            <defs>
              <linearGradient id="screenGlowPastel" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#fb7185" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fde68a" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M 20,35 Q 250,-5 480,35"
              fill="none"
              stroke="url(#screenGlowPastel)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-rose-200/30 blur-xl pointer-events-none" />
        </div>
        <p className="text-[11px] tracking-widest uppercase font-black text-rose-700/80 mt-1">
          Cinema Screen — All Eyes This Way
        </p>
      </div>

      {/* Error alert notice */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Interactive Seat Grid in Pastel */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs font-medium">Loading live seat availability...</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[580px] max-w-3xl mx-auto space-y-4">
            {seatsByRow.map(({ row, seats, tier }) => {
              const isTierDivider = row === 'A' || row === 'C' || row === 'F';
              const tierPrice = tier === 'VIP' ? show.pricing.VIP : tier === 'Premium' ? show.pricing.Premium : show.pricing.Standard;

              return (
                <div key={row} className="space-y-1.5">
                  {isTierDivider && (
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-wider pt-3 pb-1 border-t border-slate-100">
                      <span className="flex items-center gap-1.5">
                        {tier === 'VIP' && <span className="text-amber-800">★ VIP Lounger (Rows A-B)</span>}
                        {tier === 'Premium' && <span className="text-pink-800">◆ Premium Seating (Rows C-E)</span>}
                        {tier === 'Standard' && <span className="text-sky-800">● Standard Seating (Rows F-H)</span>}
                      </span>
                      <span className="text-rose-700 font-bold">₹{tierPrice}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2">
                    {/* Row Label Left */}
                    <span className="w-6 text-center text-xs font-bold text-slate-400 font-mono">{row}</span>

                    {/* Seats in Row */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {seats.map((seat, index) => {
                        const isSelected = selectedSeatIds.includes(seat.id);
                        const isBooked = seat.status === 'booked';
                        const isBlocked = seat.status === 'blocked';
                        const isAisleGap = index === 2 || index === 6;

                        return (
                          <React.Fragment key={seat.id}>
                            <button
                              disabled={isBooked || isBlocked}
                              onClick={() => handleSeatClick(seat)}
                              title={
                                isBooked
                                  ? `${seat.id} (Already Booked)`
                                  : isBlocked
                                  ? `${seat.id} (Blocked)`
                                  : `${seat.id} - ${seat.tier} (₹${seat.price})`
                              }
                              className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center transition-all duration-150 cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 text-slate-900 shadow-sm scale-110 z-10 ring-2 ring-rose-400 font-black'
                                  : isBooked
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                                  : isBlocked
                                  ? 'bg-slate-50 text-slate-400 border border-dashed border-slate-300 cursor-not-allowed'
                                  : seat.tier === 'VIP'
                                  ? 'bg-amber-50/80 border border-amber-200 text-amber-900 hover:bg-amber-100 hover:scale-105 shadow-2xs'
                                  : seat.tier === 'Premium'
                                  ? 'bg-pink-50/80 border border-pink-200 text-pink-900 hover:bg-pink-100 hover:scale-105 shadow-2xs'
                                  : 'bg-sky-50/80 border border-sky-200 text-sky-900 hover:bg-sky-100 hover:scale-105 shadow-2xs'
                              }`}
                            >
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 stroke-[3] text-slate-900" />
                              ) : isBooked ? (
                                '✕'
                              ) : (
                                seat.number
                              )}
                            </button>

                            {/* Cinema Aisle Gap */}
                            {isAisleGap && <div className="w-3 sm:w-5" />}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Row Label Right */}
                    <span className="w-6 text-center text-xs font-bold text-slate-400 font-mono">{row}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pastel Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-sky-50 border border-sky-200" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-rose-400 to-amber-300 text-slate-900 flex items-center justify-center text-[10px] font-bold">
            ✓
          </div>
          <span className="font-bold text-slate-900">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-[10px]">
            ✕
          </div>
          <span>Already Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-slate-50 border border-dashed border-slate-300" />
          <span>Blocked</span>
        </div>
      </div>

      {/* Selected Seats Bottom Action Bar */}
      <div className="bg-gradient-to-r from-rose-50/80 via-pink-50/60 to-amber-50/50 border border-rose-100 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-bold">Selected Seats ({selectedSeatIds.length}/{MAX_SEATS}):</span>
            {selectedSeatIds.length === 0 ? (
              <span className="text-xs text-slate-400 italic">None selected yet</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedSeatIds.map((id) => (
                  <span
                    key={id}
                    className="px-2 py-0.5 rounded-lg text-xs font-black bg-rose-200/80 text-rose-900 border border-rose-300"
                  >
                    {id}
                  </span>
                ))}
              </div>
            )}
          </div>

          {selectedSeatIds.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 font-medium">
              <span>Subtotal: <strong className="text-slate-900">₹{subtotal}</strong></span>
              <span>&bull;</span>
              <span>Fee: <strong className="text-slate-900">₹{convenienceFee}</strong></span>
              <span>&bull;</span>
              <span>Tax (5% GST): <strong className="text-slate-900">₹{tax}</strong></span>
            </div>
          )}
        </div>

        {/* Total & Proceed Button */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Amount</span>
            <span className="text-2xl font-black text-rose-800">
              ₹{totalAmount}
            </span>
          </div>

          <button
            disabled={selectedSeatIds.length === 0}
            onClick={() => onProceedToPayment(selectedSeatIds, totalAmount, subtotal, convenienceFee, tax)}
            className={`py-3 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer ${
              selectedSeatIds.length === 0
                ? 'opacity-40 bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-amber-400 text-slate-900 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            Proceed to Checkout &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
