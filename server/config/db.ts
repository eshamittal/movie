import mongoose from 'mongoose';

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('ℹ️  No MONGODB_URI detected in environment. Running with in-memory database store (zero setup needed).');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed, falling back to embedded memory store:', (error as Error).message);
    return false;
  }
}
