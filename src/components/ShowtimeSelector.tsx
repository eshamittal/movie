import React from 'react';
import { Calendar, MapPin, Sparkles, Volume2 } from 'lucide-react';
import { Show, Theatre } from '../types/index.ts';

interface ShowtimeSelectorProps {
  shows: Show[];
  theatres: Theatre[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onSelectShow: (show: Show) => void;
}

export const ShowtimeSelector: React.FC<ShowtimeSelectorProps> = ({
  shows,
  theatres,
  selectedDate,
  onSelectDate,
  onSelectShow,
}) => {
  // Generate 5 dates starting today
  const dateOptions = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return { dateStr, dayName, monthDay };
  });

  // Filter shows matching the selected date
  const filteredShows = shows.filter((s) => s.showDate === selectedDate);

  // Group shows by Theatre
  const showsByTheatre = theatres
    .map((theatre) => {
      const theatreShows = filteredShows.filter((s) => s.theatreId === theatre._id);
      return {
        theatre,
        shows: theatreShows,
      };
    })
    .filter((group) => group.shows.length > 0);

  return (
    <div className="space-y-6">
      {/* Date Selection Strip in Pastel */}
      <div className="bg-white border border-rose-100/90 rounded-3xl p-3 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-rose-700 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-rose-500" />
          <span>Select Date</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {dateOptions.map(({ dateStr, dayName, monthDay }) => {
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`flex-1 min-w-[95px] py-2.5 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 border-rose-300 text-slate-900 font-black shadow-sm scale-[1.02]'
                    : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-rose-50/40 hover:border-rose-200'
                }`}
              >
                <div className={`text-[10px] font-bold uppercase ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                  {dayName}
                </div>
                <div className="text-sm font-extrabold mt-0.5">{monthDay}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shows List Grouped by Theatre */}
      {showsByTheatre.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-rose-100 shadow-xs">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-slate-800 font-bold text-base mb-1">No Shows Scheduled for this Date</h4>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Please pick another date from the strip above or explore alternative nearby multiplexes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {showsByTheatre.map(({ theatre, shows }) => (
            <div
              key={theatre._id}
              className="bg-white border border-rose-100/80 rounded-3xl p-5 sm:p-6 hover:border-rose-300 transition-colors shadow-xs"
            >
              {/* Theatre Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{theatre.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{theatre.address}</span>
                  </p>
                </div>

                {/* Facilities Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {theatre.facilities.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Showtimes Grid in Pastel */}
              <div className="pt-4 flex flex-wrap gap-3">
                {shows.map((show) => {
                  const available = show.totalSeats - (show.bookedSeats?.length || 0) - (show.blockedSeats?.length || 0);
                  const isAlmostFull = available <= 10;
                  const isSoldOut = available <= 0;

                  return (
                    <button
                      key={show._id}
                      disabled={isSoldOut}
                      onClick={() => onSelectShow(show)}
                      className={`group p-3 rounded-2xl border text-left transition-all duration-200 min-w-[145px] cursor-pointer ${
                        isSoldOut
                          ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                          : 'bg-slate-50/70 hover:bg-rose-50/70 border-slate-200 hover:border-rose-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                          {show.startTime}
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                          {show.format}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span className="font-bold text-rose-700">₹{show.basePrice}</span>
                        <span
                          className={`text-[10px] font-bold ${
                            isSoldOut
                              ? 'text-red-600'
                              : isAlmostFull
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {isSoldOut ? 'Sold Out' : `${available} seats`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
