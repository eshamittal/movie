import bcrypt from 'bcryptjs';
import { Booking, Movie, Show, Theatre } from '../../src/types/index.ts';

export const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Admin@123', 10);
export const USER_PASSWORD_HASH = bcrypt.hashSync('User@123', 10);

// Helper to get formatted date string (YYYY-MM-DD)
export const getRelativeDate = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const initialUsers = [
  {
    _id: 'usr_admin_001',
    name: 'Administrator',
    email: 'admin@imovies.com',
    passwordHash: ADMIN_PASSWORD_HASH,
    role: 'admin' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'usr_demo_002',
    name: 'Rahul Sharma',
    email: 'user@imovies.com',
    passwordHash: USER_PASSWORD_HASH,
    role: 'user' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialTheatres: Theatre[] = [
  {
    _id: 'th_001',
    name: 'IMovies PVR IMAX: Grand Central',
    location: 'Bandra West',
    address: 'Grand Central Boulevard, Bandra West, Mumbai 400050',
    city: 'Mumbai',
    screens: [
      { screenNumber: 1, screenName: 'IMAX Laser 3D Audi 1', totalSeats: 72, soundSystem: 'IMAX 12.1 Immersive' },
      { screenNumber: 2, screenName: 'Dolby Atmos Gold Screen 2', totalSeats: 72, soundSystem: 'Dolby Atmos 64 Channel' },
    ],
    facilities: ['IMAX Laser', 'Recliner Loungers', 'Gourmet Kitchen', 'Valet Parking', 'Wheelchair Access'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'th_002',
    name: 'IMovies Cinepolis Luxe: Forum Mall',
    location: 'Koramangala',
    address: 'Forum Prestige Mall, 4th Floor, Hosur Road, Bangalore 560095',
    city: 'Bangalore',
    screens: [
      { screenNumber: 1, screenName: 'Luxe VIP Audi 1', totalSeats: 72, soundSystem: 'Dolby 7.1 Surround' },
      { screenNumber: 2, screenName: '4DX Experience Screen 2', totalSeats: 72, soundSystem: 'Dolby Atmos' },
    ],
    facilities: ['4DX Motion Seats', 'In-Seat Service', 'Coffee Bar', 'Covered Parking'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'th_003',
    name: 'IMovies INOX Megaplex: Cyber Hub',
    location: 'DLF Cyber City',
    address: 'Cyber Hub Building 10, Sector 24, Gurugram / Delhi NCR 122002',
    city: 'Delhi NCR',
    screens: [
      { screenNumber: 1, screenName: 'ScreenX 270 Panoramic', totalSeats: 72, soundSystem: 'Dolby Atmos' },
      { screenNumber: 2, screenName: 'Onyx LED Cinema Hall', totalSeats: 72, soundSystem: 'JBL Cinema Sound' },
    ],
    facilities: ['Samsung Onyx LED', 'Free Wi-Fi', 'Premium Lounge', 'Metro Connected'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'th_004',
    name: 'IMovies Prasad Large Screen: Necklace Road',
    location: 'Necklace Road',
    address: 'NTR Gardens, Necklace Road, Hyderabad 500063',
    city: 'Hyderabad',
    screens: [
      { screenNumber: 1, screenName: 'Giant Screen Audi 6', totalSeats: 72, soundSystem: 'Dual Barco Laser + Atmos' },
    ],
    facilities: ['Gigantic 95ft Screen', 'Ample Parking', 'Food Plaza', 'Game Zone'],
    createdAt: new Date().toISOString(),
  },
];

export const initialMovies: Movie[] = [
  {
    _id: 'mov_001',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genre: ['Sci-Fi', 'Adventure', 'Drama', 'Action'],
    language: 'English',
    duration: 166,
    releaseDate: '2024-03-01',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler', 'Florence Pugh'],
    director: 'Denis Villeneuve',
    rating: 8.6,
    votesCount: 384000,
    certification: 'U/A 16+',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    status: 'now-showing' as const,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mov_002',
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral paradoxes and political firestorm that ensued.',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: '2023-07-21',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
    director: 'Christopher Nolan',
    rating: 8.9,
    votesCount: 712000,
    certification: 'A (18+)',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    status: 'now-showing' as const,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mov_003',
    title: 'Interstellar (10th Anniversary IMAX)',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    releaseDate: '2024-09-27',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine', 'Matt Damon'],
    director: 'Christopher Nolan',
    rating: 8.7,
    votesCount: 940000,
    certification: 'U/A',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    status: 'now-showing' as const,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mov_004',
    title: 'Spider-Man: Beyond the Spider-Verse',
    description: 'Miles Morales traverses the multiverse in an epic climax to the Spider-Verse saga, teaming up with Gwen Stacy and an armada of Spider-People across dimensions to save his father and rectify the fabric of destiny.',
    genre: ['Animation', 'Action', 'Sci-Fi'],
    language: 'English',
    duration: 142,
    releaseDate: '2025-06-20',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya', 'Karan Soni'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    rating: 9.1,
    votesCount: 450000,
    certification: 'U/A 13+',
    trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
    status: 'now-showing' as const,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mov_005',
    title: 'Deadpool & Wolverine',
    description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy in the Time Variance Authority wasteland.',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    language: 'English',
    duration: 128,
    releaseDate: '2024-07-26',
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
    director: 'Shawn Levy',
    rating: 7.8,
    votesCount: 310000,
    certification: 'A (18+)',
    trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk',
    status: 'now-showing' as const,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mov_006',
    title: 'Gladiator II',
    description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    genre: ['Action', 'Adventure', 'Drama'],
    language: 'English',
    duration: 148,
    releaseDate: '2024-11-22',
    posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1600&q=80',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen', 'Joseph Quinn'],
    director: 'Ridley Scott',
    rating: 7.6,
    votesCount: 185000,
    certification: 'A (18+)',
    trailerUrl: 'https://www.youtube.com/embed/4rgYUipGJNo',
    status: 'now-showing' as const,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mov_007',
    title: 'Avatar: Fire and Ash',
    description: 'Jake Sully and Neytiri encounter the Ash People, a volcanic and aggressive tribe of Na\'vi led by Varang, challenging their perception of Pandora and threatening the delicate balance of their clan.',
    genre: ['Sci-Fi', 'Action', 'Adventure', 'Fantasy'],
    language: 'English',
    duration: 190,
    releaseDate: '2025-12-19',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang', 'Oona Chaplin'],
    director: 'James Cameron',
    rating: 0,
    votesCount: 0,
    certification: 'U/A',
    trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
    status: 'upcoming' as const,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mov_008',
    title: 'The Batman: Part II',
    description: 'Bruce Wayne delves deeper into Gotham\'s criminal underworld as corruption and new rogue villains challenge the vigilante\'s moral compass in the aftermath of the citywide flood.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 165,
    releaseDate: '2026-10-02',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    cast: ['Robert Pattinson', 'Andy Serkis', 'Jeffrey Wright', 'Colin Farrell'],
    director: 'Matt Reeves',
    rating: 0,
    votesCount: 0,
    certification: 'U/A 16+',
    trailerUrl: 'https://www.youtube.com/embed/mqqft2x_Aa4',
    status: 'upcoming' as const,
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

// Helper to generate dynamic shows across dates for all theatres and movies
export function generateShowsList(): Show[] {
  const dates = [
    getRelativeDate(0), // Today
    getRelativeDate(1), // Tomorrow
    getRelativeDate(2), // Day after
    getRelativeDate(3),
    getRelativeDate(4),
  ];

  const shows: Show[] = [];
  let showCounter = 1;

  // We assign shows for now-showing movies
  const nowShowingMovies = initialMovies.filter((m) => m.status === 'now-showing');

  for (const date of dates) {
    for (const theatre of initialTheatres) {
      for (const movie of nowShowingMovies) {
        // Create 2 showtimes per theatre per movie
        const timeSlots = [
          { time: '11:00 AM', format: 'IMAX 3D', basePrice: 350 },
          { time: '03:15 PM', format: 'Dolby Cinema', basePrice: 320 },
          { time: '07:30 PM', format: 'IMAX 3D', basePrice: 420 },
          { time: '10:45 PM', format: '2D', basePrice: 260 },
        ];

        // Pick 2 slots depending on movie index to vary schedule
        const slot1 = timeSlots[(showCounter) % timeSlots.length];
        const slot2 = timeSlots[(showCounter + 2) % timeSlots.length];

        for (const slot of [slot1, slot2]) {
          const showId = `shw_${String(showCounter).padStart(4, '0')}`;
          
          // Seed some booked seats to show realistic seat reservations
          const preBooked = (showCounter % 2 === 0) 
            ? ['C4', 'C5', 'D4', 'D5', 'A1', 'B8'] 
            : ['F6', 'F7', 'E3', 'E4'];

          shows.push({
            _id: showId,
            movieId: movie._id,
            theatreId: theatre._id,
            screenNumber: (showCounter % 2) + 1,
            format: slot.format as '2D' | '3D' | 'IMAX 3D' | '4DX' | 'Dolby Cinema',
            showDate: date,
            startTime: slot.time,
            endTime: 'Approx 3h',
            basePrice: slot.basePrice,
            pricing: {
              VIP: slot.basePrice + 160,
              Premium: slot.basePrice + 60,
              Standard: slot.basePrice,
            },
            totalSeats: 72,
            bookedSeats: preBooked,
            blockedSeats: ['B1', 'H9'], // Maintenance blocked seats
            status: 'scheduled',
            createdAt: new Date().toISOString(),
          });

          showCounter++;
        }
      }
    }
  }

  return shows;
}

export const initialBookings: Booking[] = [
  {
    _id: 'bkg_001',
    bookingReference: 'IMV-948201',
    userId: 'usr_demo_002',
    showId: 'shw_0001',
    movieId: 'mov_001',
    theatreId: 'th_001',
    selectedSeats: ['C4', 'C5'],
    seatDetails: [
      { seatId: 'C4', tier: 'Premium' as const, price: 380 },
      { seatId: 'C5', tier: 'Premium' as const, price: 380 },
    ],
    numberOfTickets: 2,
    subtotal: 760,
    convenienceFee: 60,
    tax: 38,
    totalAmount: 858,
    bookingStatus: 'confirmed' as const,
    paymentStatus: 'paid' as const,
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    transactionId: 'TXN-9028471625',
    bookedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];
