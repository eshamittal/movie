import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number; // in minutes
  releaseDate: Date;
  posterUrl: string;
  bannerUrl: string;
  cast: string[];
  director: string;
  rating: number;
  votesCount?: number;
  certification?: string;
  trailerUrl?: string;
  status: 'now-showing' | 'upcoming';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    genre: {
      type: [String],
      required: true,
      validate: [(v: string[]) => v.length > 0, 'At least one genre must be specified'],
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 minute'],
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster URL is required'],
    },
    bannerUrl: {
      type: String,
      required: [true, 'Banner URL is required'],
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    votesCount: {
      type: Number,
      default: 0,
    },
    certification: {
      type: String,
      default: 'U/A',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['now-showing', 'upcoming'],
      default: 'now-showing',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MovieModel = mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
