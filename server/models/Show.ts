import mongoose, { Schema, Document } from 'mongoose';

export interface IShow extends Document {
  movieId: mongoose.Types.ObjectId;
  theatreId: mongoose.Types.ObjectId;
  screenNumber: number;
  format: string;
  showDate: string; // YYYY-MM-DD
  startTime: string; // "14:30"
  endTime?: string;
  basePrice: number;
  pricing: {
    VIP: number;
    Premium: number;
    Standard: number;
  };
  totalSeats: number;
  bookedSeats: string[];
  blockedSeats: string[];
  status: 'scheduled' | 'running' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const ShowSchema = new Schema<IShow>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie ID is required'],
      index: true,
    },
    theatreId: {
      type: Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre ID is required'],
      index: true,
    },
    screenNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX 3D', '4DX', 'Dolby Cinema'],
      default: '2D',
    },
    showDate: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
    },
    basePrice: {
      type: Number,
      required: true,
      default: 250,
    },
    pricing: {
      VIP: { type: Number, default: 450 },
      Premium: { type: Number, default: 320 },
      Standard: { type: Number, default: 220 },
    },
    totalSeats: {
      type: Number,
      default: 72,
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    blockedSeats: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['scheduled', 'running', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
);

// Compound index to quickly find shows for a movie on a date
ShowSchema.index({ movieId: 1, showDate: 1 });
ShowSchema.index({ theatreId: 1, showDate: 1 });

export const ShowModel = mongoose.models.Show || mongoose.model<IShow>('Show', ShowSchema);
