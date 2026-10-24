import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Printer, Film, Calendar, Clock, MapPin, X, QrCode } from 'lucide-react';
import { Booking } from '../types/index.ts';

interface TicketModalProps {
  booking: Booking;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  useEffect(() => {
    // Launch celebratory cinema confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#fde68a', '#38bdf8'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-rose-200 rounded-3xl shadow-2xl overflow-hidden my-6 print:border-none print:shadow-none print:p-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="print:hidden absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Banner in Pastel Mint */}
        <div className="print:hidden bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 border-b border-emerald-200 px-6 py-3 text-emerald-900 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Booking Confirmed & Seats Reserved!</span>
          </div>
          <span className="font-mono text-[11px] bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
            {booking.bookingReference}
          </span>
        </div>

        {/* Authentic Cinema E-Ticket Board in Soft Ivory Pastel */}
        <div id="cinema-ticket" className="p-6 sm:p-8 bg-[#FAF8F5] text-slate-800 relative">
          {/* Cinema Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 flex items-center justify-center shadow-xs">
                <Film className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  I<span className="text-rose-500">MOVIES</span> PASS
                </span>
                <span className="block text-[9px] tracking-widest uppercase text-slate-500 font-bold">
                  Electronic Cinema Ticket
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Booking ID
              </span>
              <span className="text-base font-black text-rose-700 font-mono tracking-wider">
                {booking.bookingReference}
              </span>
            </div>
          </div>

          {/* Ticket Body with Poster & Details */}
          <div className="py-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start border-b border-slate-200/80">
            <img
              src={booking.movie?.posterUrl}
              alt={booking.movie?.title}
              className="w-24 sm:w-28 aspect-[2/3] object-cover rounded-2xl shadow-md border border-slate-200"
            />

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h3 className="text-xl font-black text-slate-900">{booking.movie?.title}</h3>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                    {booking.show?.format || '2D'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {booking.movie?.certification || 'U/A'}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {booking.movie?.language}
                  </span>
                </div>
              </div>

              {/* Theatre & Screen */}
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{booking.theatre?.name}</span>
                </p>
                <p className="text-slate-500 text-[11px]">{booking.theatre?.address}</p>
                <p className="text-slate-700 font-bold">
                  Auditorium / Screen {booking.show?.screenNumber}
                </p>
              </div>

              {/* Date & Time */}
              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{booking.show?.showDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{booking.show?.startTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Perforated Divider Visual */}
          <div className="relative -mx-6 sm:-mx-8 my-1 flex items-center justify-between">
            <div className="w-4 h-8 bg-white rounded-r-full -ml-2 border-r border-rose-200" />
            <div className="flex-1 border-b-2 border-dashed border-slate-300 mx-2" />
            <div className="w-4 h-8 bg-white rounded-l-full -mr-2 border-l border-rose-200" />
          </div>

          {/* Seats & QR Code Section in Pastel */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  Reserved Seats ({booking.numberOfTickets})
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mt-1">
                  {booking.selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-2.5 py-1 rounded-xl text-sm font-black bg-rose-200 text-rose-900 border border-rose-300 shadow-2xs"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-1 text-xs text-slate-600">
                <span>Total Paid: </span>
                <strong className="text-slate-900 text-sm font-black">₹{booking.totalAmount}</strong>
                <span className="text-[11px] text-emerald-700 font-bold ml-1.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {booking.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* QR Code Graphic */}
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
              <div className="w-22 h-22 bg-slate-900 p-1 flex items-center justify-center rounded-xl">
                <QrCode className="w-18 h-18 text-white" />
              </div>
              <span className="text-[9px] font-mono text-slate-600 font-bold mt-1 tracking-wider">
                SCAN AT ENTRY
              </span>
            </div>
          </div>

          {/* Barcode Mock Visual */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <div className="h-9 flex items-center justify-center gap-0.5 opacity-80 overflow-hidden">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="h-full bg-slate-700"
                  style={{
                    width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1.5 : 2)}px`,
                    opacity: i % 5 === 0 ? 0.3 : 1,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 mt-1 block">
              {booking.transactionId || 'TXN-9028471625'}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="print:hidden p-4 sm:p-6 bg-white border-t border-rose-100 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Pass stored in <strong className="text-slate-800">My Bookings</strong>.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 hover:from-rose-500 hover:to-amber-400 transition-colors shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
