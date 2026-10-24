import mongoose, { Schema, Document } from 'mongoose';

export interface ITheatre extends Document {
  name: string;
  location: string;
  address: string;
  city: string;
  screens: {
    screenNumber: number;
    screenName: string;
    totalSeats: number;
    soundSystem: string;
  }[];
  facilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ScreenSchema = new Schema({
  screenNumber: { type: Number, required: true },
  screenName: { type: String, required: true },
  totalSeats: { type: Number, default: 72 },
  soundSystem: { type: String, default: 'Dolby Atmos' },
});

const TheatreSchema = new Schema<ITheatre>(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Mumbai',
    },
    screens: [ScreenSchema],
    facilities: {
      type: [String],
      default: ['Air Conditioned', 'Dolby Atmos', 'Recliner Seating', 'Food & Beverages', 'Parking Available'],
    },
  },
  { timestamps: true }
);

export const TheatreModel = mongoose.models.Theatre || mongoose.model<ITheatre>('Theatre', TheatreSchema);
