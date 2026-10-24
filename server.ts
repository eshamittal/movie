import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/authRoutes.ts';
import movieRoutes from './server/routes/movieRoutes.ts';
import theatreRoutes from './server/routes/theatreRoutes.ts';
import showRoutes from './server/routes/showRoutes.ts';
import bookingRoutes from './server/routes/bookingRoutes.ts';
import adminRoutes from './server/routes/adminRoutes.ts';
import { connectDB } from './server/config/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect Database (MongoDB or In-memory fallback)
  await connectDB();

  // API Health route
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'UP',
      service: 'IMovies Backend API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/movies', movieRoutes);
  app.use('/api/theatres', theatreRoutes);
  app.use('/api/shows', showRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/admin', adminRoutes);

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 IMovies Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start IMovies server:', err);
  process.exit(1);
});
