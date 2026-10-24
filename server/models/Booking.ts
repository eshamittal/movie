import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingReference: string;
  userId: mongoose.Types.ObjectId;
  showId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  theatreId: mongoose.Types.ObjectId;
  selectedSeats: string[];
  seatDetails: {
    seatId: string;
    tier: string;
    price: number;
  }[];
  numberOfTickets: number;
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  bookingStatus: 'confirmed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  bookedAt: Date;
  cancelledAt?: Date;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    showId: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true,
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theatreId: {
      type: Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    selectedSeats: {
      type: [String],
      required: true,
      validate: [(v: string[]) => v.length > 0, 'At least one seat must be selected'],
    },
    seatDetails: [
      {
        seatId: { type: String, required: true },
        tier: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    numberOfTickets: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 30,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'failed', 'refunded'],
      default: 'paid',
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card',
    },
    transactionId: {
      type: String,
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    cancelledAt: {
      type: Date,
    },
    refundAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
