import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, Clock, MapPin, XCircle, Printer, RefreshCw, AlertTriangle } from 'lucide-react';
import { Booking } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { TicketModal } from '../components/TicketModal.tsx';

interface MyBookingsPageProps {
  onExploreMovies: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ onExploreMovies }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.bookings.getMyBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;

    setCancellingId(cancelModalBooking._id);
    try {
      await api.bookings.cancel(cancelModalBooking._id);
      await fetchBookings();
      setCancelModalBooking(null);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingBookings = bookings.filter((b) => {
    if (b.bookingStatus === 'cancelled') return false;
    const showDate = b.show?.showDate || todayStr;
    return showDate >= todayStr;
  });

  const pastAndCancelledBookings = bookings.filter((b) => {
    if (b.bookingStatus === 'cancelled') return true;
    const showDate = b.show?.showDate || todayStr;
    return showDate < todayStr;
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastAndCancelledBookings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-rose-100 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Ticket className="w-8 h-8 text-rose-500" />
            <span>My Cinema Bookings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your movie tickets, download printable passes, and manage cancellations
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="self-start sm:self-auto px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* Tabs Switcher in Pastel */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-gradient-to-r from-rose-400 to-amber-300 text-slate-900 shadow-xs font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Upcoming Bookings ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'past'
              ? 'bg-gradient-to-r from-rose-400 to-amber-300 text-slate-900 shadow-xs font-black'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Past & Cancelled ({pastAndCancelledBookings.length})
        </button>
      </div>

      {/* Bookings List in Pastel */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : displayedBookings.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-rose-100 space-y-4 shadow-xs">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Bookings Found</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? "You don't have any tickets booked for future shows right now."
              : 'No past booking records available.'}
          </p>
          {activeTab === 'upcoming' && (
            <button
              onClick={onExploreMovies}
              className="px-5 py-2.5 rounded-2xl text-xs font-black text-slate-900 bg-gradient-to-r from-rose-400 to-amber-300 hover:from-rose-500 hover:to-amber-400 shadow-xs cursor-pointer"
            >
              Browse Movies Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBookings.map((booking) => {
            const isCancelled = booking.bookingStatus === 'cancelled';

            return (
              <div
                key={booking._id}
                className="bg-white border border-rose-100/90 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-rose-300 transition-all shadow-xs"
              >
                {/* Poster & Summary */}
                <div className="flex gap-4 items-center">
                  <img
                    src={booking.movie?.posterUrl}
                    alt={booking.movie?.title}
                    className="w-16 sm:w-20 aspect-[2/3] object-cover rounded-2xl border border-slate-200 shadow-xs"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md">
                        {booking.bookingReference}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isCancelled
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isCancelled ? 'Cancelled' : 'Confirmed'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900">{booking.movie?.title}</h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span>{booking.theatre?.name} &bull; Screen {booking.show?.screenNumber}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        {booking.show?.showDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {booking.show?.startTime}
                      </span>
                      <span className="font-bold text-rose-700">
                        {booking.show?.format}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seat Numbers & Financials */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center gap-4 sm:gap-6 w-full md:w-auto justify-between border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      Reserved Seats ({booking.numberOfTickets})
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1 justify-start md:justify-end">
                      {booking.selectedSeats.map((seat) => (
                        <span
                          key={seat}
                          className="px-2 py-0.5 rounded-md text-xs font-black bg-rose-50 text-rose-800 border border-rose-200"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                    <span className="block text-xs text-slate-500 mt-1.5">
                      Paid: <strong className="text-slate-900 font-extrabold">₹{booking.totalAmount}</strong>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {!isCancelled && (
                      <>
                        <button
                          onClick={() => setSelectedTicket(booking)}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                          <span>View Ticket</span>
                        </button>

                        <button
                          onClick={() => setCancelModalBooking(booking)}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}

                    {isCancelled && (
                      <span className="text-xs text-slate-400 italic font-medium">
                        Refund processed (₹{booking.refundAmount || booking.subtotal})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal in Pastel */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-rose-100 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Cancel Booking Confirmation</h3>
                <p className="text-xs text-slate-500">Ref: {cancelModalBooking.bookingReference}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your reservation for{' '}
              <strong className="text-slate-900">{cancelModalBooking.movie?.title}</strong>?
            </p>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Seats Released:</span>
                <strong className="text-slate-900">{cancelModalBooking.selectedSeats.join(', ')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Refund Subtotal:</span>
                <strong className="text-emerald-700 font-bold">₹{cancelModalBooking.subtotal}</strong>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                <span>Policy:</span>
                <span>Seats immediately returned to live inventory</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={Boolean(cancellingId)}
                onClick={handleCancelBooking}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-sm cursor-pointer"
              >
                <span>{cancellingId ? 'Processing...' : 'Confirm Cancellation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Viewer Modal */}
      {selectedTicket && (
        <TicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
