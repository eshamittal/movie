import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { initialUsers, initialMovies, initialTheatres, generateShowsList, initialBookings } from '../data/seedData.ts';
import { UserModel } from '../models/User.ts';
import { MovieModel } from '../models/Movie.ts';
import { TheatreModel } from '../models/Theatre.ts';
import { ShowModel } from '../models/Show.ts';
import { BookingModel } from '../models/Booking.ts';

dotenv.config();

async function runSeed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies';

  console.log(`Connecting to MongoDB at: ${mongoUri}`);
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected.');

    // Clear existing collections
    console.log('Clearing existing cinema records...');
    await Promise.all([
      UserModel.deleteMany({}),
      MovieModel.deleteMany({}),
      TheatreModel.deleteMany({}),
      ShowModel.deleteMany({}),
      BookingModel.deleteMany({}),
    ]);

    // Insert Users
    console.log('Inserting initial users...');
    await UserModel.insertMany(initialUsers);

    // Insert Theatres
    console.log('Inserting initial theatres...');
    await TheatreModel.insertMany(initialTheatres);

    // Insert Movies
    console.log('Inserting initial movies...');
    await MovieModel.insertMany(initialMovies);

    // Generate and Insert Shows
    console.log('Scheduling initial shows...');
    const shows = generateShowsList();
    await ShowModel.insertMany(shows);

    // Insert initial bookings
    console.log('Inserting sample bookings...');
    await BookingModel.insertMany(initialBookings);

    console.log('✅ Database successfully seeded with movies, theatres, shows, and admin accounts!');
    console.log('----------------------------------------------------');
    console.log('Admin Login:  admin@imovies.com  |  Password: Admin@123');
    console.log('Demo User:    user@imovies.com   |  Password: User@123');
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed MongoDB:', err);
    process.exit(1);
  }
}

runSeed();
