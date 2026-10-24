import React, { useState } from 'react';
import { CreditCard, QrCode, Building, ShieldCheck, Lock, AlertTriangle, Loader2 } from 'lucide-react';
import { Booking, Show } from '../types/index.ts';
import { api } from '../services/api.ts';

interface PaymentModalProps {
  show: Show;
  selectedSeats: string[];
  totalAmount: number;
  subtotal: number;
  convenienceFee: number;
  tax: number;
  onSuccess: (booking: Booking) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  show,
  selectedSeats,
  totalAmount,
  subtotal,
  convenienceFee,
  tax,
  onSuccess,
  onClose,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardHolder, setCardHolder] = useState('Rahul Sharma');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('842');
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg(null);

    const paymentLabel =
      paymentMethod === 'upi'
        ? `UPI (${upiId})`
        : paymentMethod === 'card'
        ? `Card (Ending in ${cardNumber.slice(-4)})`
        : `Net Banking (${selectedBank})`;

    try {
      const res = await api.bookings.create({
        showId: show._id,
        selectedSeats,
        paymentMethod: paymentLabel,
      });

      if (res.success && res.booking) {
        onSuccess(res.booking);
      } else {
        throw new Error(res.message || 'Payment failed.');
      }
    } catch (err: any) {
      if (err.status === 409) {
        setErrorMsg(err.message || 'Conflict: One or more selected seats were just reserved by another guest. Please reselect.');
      } else {
        setErrorMsg(err.message || 'Payment transaction failed. Please check your details and retry.');
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-rose-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header in Soft Pastel */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-50/80 via-pink-50/60 to-amber-50/50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Secure Checkout & Payment</h3>
              <p className="text-xs text-slate-500">256-Bit SSL Encrypted Cinema Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary Card in Pastel */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
            <img
              src={show.movie?.posterUrl}
              alt={show.movie?.title}
              className="w-16 h-22 object-cover rounded-xl border border-slate-200 shadow-xs"
            />
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-extrabold text-slate-900">{show.movie?.title}</h4>
              <p className="text-xs text-slate-500">
                {show.theatre?.name} &bull; Screen {show.screenNumber} ({show.format})
              </p>
              <p className="text-xs text-slate-500">
                {show.showDate} at <strong className="text-slate-800">{show.startTime}</strong>
              </p>
              <div className="flex flex-wrap gap-1 justify-center sm:justify-start pt-1">
                <span className="text-[11px] text-slate-500">Seats:</span>
                {selectedSeats.map((s) => (
                  <span
                    key={s}
                    className="px-1.5 py-0.5 rounded-md text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="sm:border-l sm:border-slate-200 sm:pl-4 text-right w-full sm:w-auto space-y-0.5 text-xs text-slate-500 border-t border-slate-200 sm:border-t-0 pt-3 sm:pt-0">
              <div className="flex justify-between sm:justify-end gap-3">
                <span>Tickets ({selectedSeats.length}):</span>
                <span className="font-bold text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-3">
                <span>Convenience Fee:</span>
                <span className="font-bold text-slate-800">₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-3">
                <span>Taxes (5% GST):</span>
                <span className="font-bold text-slate-800">₹{tax}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between sm:justify-end gap-3 text-sm">
                <span className="font-black text-slate-900">Total:</span>
                <span className="font-black text-rose-700">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Payment Method Tabs in Pastel */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Choose Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-3 px-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-rose-100 border-rose-400 text-rose-900 font-black shadow-xs ring-1 ring-rose-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-5 h-5 text-rose-600" />
                <span className="text-xs">UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-rose-100 border-rose-400 text-rose-900 font-black shadow-xs ring-1 ring-rose-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-5 h-5 text-rose-600" />
                <span className="text-xs">Debit / Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-3 px-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'bg-rose-100 border-rose-400 text-rose-900 font-black shadow-xs ring-1 ring-rose-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building className="w-5 h-5 text-rose-600" />
                <span className="text-xs">Net Banking</span>
              </button>
            </div>
          </div>

          {/* Payment Form Details */}
          <form onSubmit={handlePay} className="space-y-4">
            {paymentMethod === 'upi' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                  <span>Fast UPI Checkout (GPay / PhonePe / Paytm)</span>
                  <span className="text-emerald-700 font-bold">Instant Verification</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enter UPI ID / VPA</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>A payment request will be sent to your UPI app for approval.</span>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 0000 0000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-400 font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">Select Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                        selectedBank === bank
                          ? 'bg-rose-100 border-rose-400 text-rose-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button in Pastel Coral */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-slate-900 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 hover:from-rose-500 hover:to-amber-400 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Reserving Seats & Verifying Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-slate-900" />
                  <span>Confirm & Pay ₹{totalAmount}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
