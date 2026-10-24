# 🎬 IMovies – Online Movie Ticket Booking Platform

> **A full-stack, responsive, and college-project-ready cinema ticketing web application built with React, Node.js, Express, and MongoDB.**

---

## 🌟 Key Features

- **Movie Catalogue & Exploration:** Browse now-showing blockbusters and upcoming theatrical releases with genres, certification, languages, ratings, duration, and embedded official trailer video previews.
- **Theatres & Formats:** Explore multiplexes across major cinema hubs with IMAX Laser, Dolby Atmos, 4DX, and ScreenX technology tags.
- **Dynamic Showtimes:** Multi-day calendar date strip with live showtimes, screen indicators, and real-time seat availability counters.
- **Interactive Cinema Seat Matrix:**
  - Curved screen graphic with ambient light beam ("All eyes this way: SCREEN").
  - Three distinct pricing tiers: **VIP Recliner Lounger** (Rows A-B), **Premium Seating** (Rows C-E), and **Standard** (Rows F-H).
  - Aisle spacing and seat status states (Available, Selected, Already Booked, Blocked).
  - Maximum seat selection limit (8 seats per transaction).
- **Concurrency & Double-Booking Protection:**
  - Server-side atomic mutex locking (`withShowLock`) on show IDs.
  - Returns **HTTP 409 Conflict** if another guest claims any selected seat in parallel.
  - Server-calculated subtotals, convenience fees, and 5% entertainment taxes (never trusting client prices).
- **Simulated Payment Gateway:** Supports UPI (VPA verification), Credit/Debit cards, and Net Banking options.
- **Printable E-Ticket:** Generates high-fidelity cinema boarding pass with perforated edges, QR code, barcode, transaction reference, and print/PDF support.
- **Self-Service Cancellations:** Allows customers to cancel eligible bookings with immediate seat inventory restocking.
- **Administrator Command Center:**
  - Box office KPIs: Total Revenue, Total Bookings, Active Movies, Total Theatres.
  - Movie Management: Add, Edit, and Delete titles.
  - Show Scheduling: Schedule showtimes with custom tier pricing.
  - Booking Auditing: Search and filter user reservations.
  - Seat Maintenance: Block or unblock seats per showtime.
  - One-click Database Reseeder.
- **Academic Documentation Suite:** Built-in interactive "Project Docs & Viva" guide plus comprehensive `COLLEGE_DOCUMENTATION.md` for B.Tech evaluation.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js (REST API Architecture), TypeScript |
| **Database** | MongoDB / Mongoose (with built-in in-memory fallback) |
| **Security** | JWT (JSON Web Tokens), BCrypt password hashing |
| **Development** | Vite 8, tsx, esbuild, Postman |

---

## 🔑 Default Credentials

The system includes pre-seeded demo accounts:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@imovies.com` | `Admin@123` | Full dashboard, Movie CRUD, Shows, Seat Overrides |
| **Standard User** | `user@imovies.com` | `User@123` | Book tickets, view history, cancel bookings |

*Note: You can also register a new account directly via the UI.*

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm:** v8.0.0 or higher
- **MongoDB (Optional):** Local Community Server ([Download MongoDB](https://www.mongodb.com/try/download/community)) or MongoDB Atlas cloud URI.  
  *(If MongoDB is not installed, the application automatically runs using its resilient in-memory database store with zero setup needed!)*

### 2. Installation
Clone or extract the project files and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2025_academic_btech
CLIENT_URL=http://localhost:3000
```

### 4. Running the Application
Start the full-stack development server:
```bash
npm run dev
```
The application will launch at: **`http://localhost:3000`**

### 5. Seeding the Database (Optional for External MongoDB)
If you are connected to a standalone MongoDB instance:
```bash
npm run seed
```

---

## 🧪 Postman API Testing Guide

### 1. Register User
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Body (JSON):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password@123"
}
```

### 2. Login User
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "user@imovies.com",
  "password": "User@123"
}
```
*Copy the returned `token` and use it in subsequent requests as `Authorization: Bearer <token>`.*

### 3. Fetch Live Seat Matrix for a Show
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/shows/shw_0001/seats`

### 4. Reserve Seats
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/bookings`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
- **Body (JSON):**
```json
{
  "showId": "shw_0001",
  "selectedSeats": ["C1", "C2"],
  "paymentMethod": "UPI (jane@okhdfcbank)"
}
```

### 5. Cancel a Booking
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/bookings/<BOOKING_ID>/cancel`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`

---

## 📁 Project Structure

```
imovies/
├── server/
│   ├── config/          # Database connection (MongoDB + fallback)
│   ├── controllers/     # Express REST controllers (Auth, Movie, Show, Booking, Admin)
│   ├── data/            # Seed data & in-memory store with atomic mutex locking
│   ├── middleware/      # JWT authentication & admin authorization
│   ├── models/          # Mongoose Schemas (User, Movie, Theatre, Show, Booking)
│   ├── routes/          # Express route definitions
│   └── scripts/         # Standalone database seed script
├── src/
│   ├── components/      # UI components (Navbar, Footer, HeroBanner, SeatPicker, TicketModal...)
│   ├── context/         # AuthContext & state management
│   ├── pages/           # Pages (HomePage, MoviesPage, MovieDetails, Booking, MyBookings, Admin)
│   ├── services/        # Frontend API client
│   ├── types/           # TypeScript interfaces & types
│   ├── App.tsx          # Main React Application
│   └── main.tsx         # React root
├── COLLEGE_DOCUMENTATION.md # Comprehensive B.Tech capstone documentation & viva guide
├── server.ts            # Full-stack server entry point (Express + Vite middlewares)
├── package.json
└── README.md
```

---

## 🎓 Academic Submission & Viva Q&A
For viva voce questions, ER diagrams, Level 0 & Level 1 DFDs, and software architecture schematics, open the in-app **"Project Docs & Viva"** tab on the navigation bar, or read `COLLEGE_DOCUMENTATION.md`.
