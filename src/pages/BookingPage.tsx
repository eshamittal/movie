import React, { useState } from 'react';
import { Show, Booking } from '../types/index.ts';
import { SeatPicker } from '../components/SeatPicker.tsx';
import { PaymentModal } from '../components/PaymentModal.tsx';
import { TicketModal } from '../components/TicketModal.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface BookingPageProps {
  show: Show;
  onBack: () => void;
  onOpenAuth: () => void;
  onBookingComplete: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  show,
  onBack,
  onOpenAuth,
  onBookingComplete,
}) => {
  const { user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [pricingBreakdown, setPricingBreakdown] = useState<{
    totalAmount: number;
    subtotal: number;
    fee: number;
    tax: number;
  } | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const handleProceedToPayment = (
    seats: string[],
    totalAmount: number,
    subtotal: number,
    fee: number,
    tax: number
  ) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setSelectedSeats(seats);
    setPricingBreakdown({ totalAmount, subtotal, fee, tax });
    setPaymentModalOpen(true);
  };

  const handleBookingSuccess = (booking: Booking) => {
    setPaymentModalOpen(false);
    setConfirmedBooking(booking);
  };

  const handleCloseTicket = () => {
    setConfirmedBooking(null);
    onBookingComplete();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Steps Progress Header */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs font-semibold">
        <div className="flex items-center gap-2 text-rose-500">
          <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-[11px] font-bold">
            1
          </span>
          <span>Seat Selection</span>
        </div>
        <div className="w-8 sm:w-16 h-0.5 bg-zinc-800" />
        <div className={`flex items-center gap-2 ${paymentModalOpen ? 'text-rose-500' : 'text-zinc-500'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
            paymentModalOpen ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}>
            2
          </span>
          <span>Payment Gateway</span>
        </div>
        <div className="w-8 sm:w-16 h-0.5 bg-zinc-800" />
        <div className={`flex items-center gap-2 ${confirmedBooking ? 'text-emerald-500' : 'text-zinc-500'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
            confirmedBooking ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}>
            3
          </span>
          <span>E-Ticket</span>
        </div>
      </div>

      {/* Interactive Seat Picker */}
      <SeatPicker
        show={show}
        onProceedToPayment={handleProceedToPayment}
        onBack={onBack}
      />

      {/* Payment Gateway Modal */}
      {paymentModalOpen && pricingBreakdown && (
        <PaymentModal
          show={show}
          selectedSeats={selectedSeats}
          totalAmount={pricingBreakdown.totalAmount}
          subtotal={pricingBreakdown.subtotal}
          convenienceFee={pricingBreakdown.fee}
          tax={pricingBreakdown.tax}
          onSuccess={handleBookingSuccess}
          onClose={() => setPaymentModalOpen(false)}
        />
      )}

      {/* Confirmation & Printable E-Ticket Modal */}
      {confirmedBooking && (
        <TicketModal
          booking={confirmedBooking}
          onClose={handleCloseTicket}
        />
      )}
    </div>
  );
};
