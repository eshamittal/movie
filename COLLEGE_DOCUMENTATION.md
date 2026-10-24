# IMOVIES – ONLINE MOVIE TICKET BOOKING WEB APPLICATION
## B.Tech Capstone Project Report & Technical Documentation

---

### Table of Contents
1. **Abstract**
2. **Introduction & Motivation**
3. **Problem Statement & Justification**
4. **Project Objectives & Scope**
5. **Existing System vs. Proposed System**
6. **System Requirements Specification (SRS)**
   - Software Requirements
   - Hardware Requirements
   - Functional Requirements
   - Non-Functional Requirements
7. **System Architecture Design**
8. **Entity-Relationship (ER) Diagram & Data Dictionary**
9. **Data Flow Diagrams (DFD - Level 0, Level 1, Level 2)**
10. **Use Case Analysis & Activity Diagrams**
11. **Module Descriptions & Workflow Logic**
12. **Concurrency Control & Atomic Double-Booking Prevention**
13. **RESTful API Documentation**
14. **Software Testing & Verification Report**
15. **Limitations & Future Enhancements**
16. **Conclusion**
17. **References & Viva Voce Preparation Guide**

---

## 1. Abstract
The **IMovies Online Movie Ticket Booking Platform** is an enterprise-grade, full-stack web application developed to modernize the cinema ticketing experience for moviegoers and multiplex operators. Conventional physical ticketing and legacy desktop architectures suffer from physical queue bottlenecks, high manual overhead, and critical vulnerabilities to race-condition double bookings during simultaneous peak reservations.

IMovies is architected with a decoupled **React 19 SPA frontend**, an **Express.js / Node.js asynchronous REST API backend**, and a **MongoDB / Mongoose document database layer**. The platform provides interactive SVG-curved cinema seat maps, dynamic format-aware pricing tiers (VIP Loungers, Premium, and Standard), JWT role-based authentication, real-time atomic mutex locking for zero duplicate reservations, printable e-ticket generation with QR verification, and a comprehensive administrator command dashboard.

---

## 2. Introduction & Motivation
The entertainment industry, specifically theatrical exhibition, relies heavily on digital distribution and instant seat availability. Modern moviegoers expect immediate access to show schedules, seat configurations, format varieties (IMAX 3D, Dolby Atmos, 4DX), and instant confirmation without friction.

Developing a complete, production-grade cinema ticketing engine provides hands-on mastery over key computer science challenges:
- Handling concurrent transactions and preventing race conditions (Double Booking).
- Designing decoupled RESTful micro-architectures with token-based stateless security.
- Managing relational associative data (Shows linking Movies and Theatres) in a high-throughput NoSQL document store.
- Building reactive, accessible, and responsive user interfaces.

---

## 3. Problem Statement & Justification
### Problems with Existing Systems:
1. **Queueing Latency & Geographic Limitations:** Traditional box office booths require physical presence, creating long queues and high staffing overhead.
2. **Double Booking Hazards:** Many naive online implementations query seat availability and write the booking in disjoint queries without transactional locking, leading to concurrent booking conflicts (HTTP 409).
3. **Static Pricing Inflexibility:** Legacy systems often do not support tier-differentiated pricing (VIP vs. Standard) across varying formats (IMAX vs. Standard 2D).
4. **Opaque Cancellation Procedures:** Cancelling a ticket in legacy setups requires administrative intervention and manual seat restocking.

### Justification of IMovies:
IMovies resolves these issues through:
- Real-time client-server communication using JSON REST APIs.
- Server-side atomic reservation mutex locks that ensure atomic test-and-set operations on seat arrays.
- Automatic tax, subtotal, and convenience fee reconciliation that never trusts client input.
- Self-service cancellation workflows with automatic inventory restocking.

---

## 4. Project Objectives & Scope
### Objectives:
- **Responsive Web Portal:** Allow users to browse movies, filter by genre, language, and status, and watch trailers.
- **Showtime Scheduling:** Provide multi-day calendar views across multiplex locations.
- **Interactive Seat Matrix:** Render an SVG curved screen with row labels, aisle gaps, and tier-coded interactive seats.
- **Concurrency Protection:** Prevent duplicate bookings through atomic backend locks.
- **Secure Authentication:** Implement JWT and bcrypt password hashing with user and admin roles.
- **E-Ticket Generation:** Render printable passes featuring QR codes, barcodes, and transaction IDs.
- **Administrative Governance:** Equip managers with tools to add/edit movies, schedule shows, audit bookings, and toggle seat maintenance blocks.

---

## 5. Existing System vs. Proposed System

| Feature / Metric | Conventional / Existing System | Proposed IMovies Platform |
| :--- | :--- | :--- |
| **Booking Channel** | Physical counter or legacy desktop | 24/7 Web App (Mobile, Tablet, Desktop) |
| **Seat Selection** | Counter clerk assigns random seats | Real-time interactive seat matrix |
| **Concurrency Safeguards**| Prone to manual conflict or race conditions | Atomic server-side mutex lock |
| **Security** | Plaintext or basic session cookies | Salted BCrypt hashing + JWT Bearer Tokens |
| **Ticket Issuance** | Thermal paper tickets | Printable electronic pass with QR & Barcode |
| **Cancellation** | Physical counter refund request | 1-Click online cancellation with seat restocking |
| **Auditing & Analytics** | Manual ledger reconciliation | Live Admin KPI Dashboard (Revenue, Occupancy) |

---

## 6. System Requirements Specification (SRS)

### 6.1 Software Requirements
- **Operating System:** Windows 10/11, macOS Monterey+, or Linux (Ubuntu 20.04+)
- **Runtime Environment:** Node.js v18.0.0 or higher LTS
- **Package Manager:** npm v8.0.0 or higher
- **Frontend Framework:** React 19, TypeScript, Tailwind CSS
- **Backend Framework:** Express.js 4.21, TypeScript, tsx
- **Database:** MongoDB 6.0+ Community Server or MongoDB Atlas (with in-memory fallback)
- **API Testing Tool:** Postman v10+

### 6.2 Hardware Requirements
- **Processor:** Intel Core i5 (8th Gen+) or AMD Ryzen 5 / Apple Silicon M1+
- **RAM:** Minimum 8 GB (16 GB recommended for running DB and servers concurrently)
- **Storage:** 1 GB free disk space
- **Display:** 1366 × 768 or higher resolution

---

## 7. System Architecture Design

IMovies follows the industry-standard **3-Tier Client-Server Architecture**:

```
+-------------------------------------------------------------------------------+
|                        TIER 1: PRESENTATION LAYER (SPA)                       |
|                                                                               |
|  - React 19 Functional Components + Custom Hooks                              |
|  - Tailwind CSS Dark Cinema Theme with Responsive Grid Layouts               |
|  - Interactive SVG Cinema Curved-Screen Seat Picker                           |
|  - Context API State Management for Auth and Tokens                           |
+---------------------------------------+---------------------------------------+
                                        |
                         HTTP / REST API (JSON) + JWT
                                        |
+---------------------------------------v---------------------------------------+
|                       TIER 2: APPLICATION LOGIC LAYER                         |
|                                                                               |
|  - Node.js & Express.js REST API Gateway (Port 3000)                          |
|  - Authentication & Authorization Middleware (JWT Token Verification)         |
|  - Atomic Show-Lock Mutex (Prevents Race-Condition Double Bookings)           |
|  - Financial Reconciliation Engine (Calculates GST, Fees, Never Trusts Client)|
|  - Controllers: Auth, Movie, Theatre, Show, Booking, Admin                   |
+---------------------------------------+---------------------------------------+
                                        |
                             Mongoose ODM Queries
                                        |
+---------------------------------------v---------------------------------------+
|                        TIER 3: DATA PERSISTENCE LAYER                         |
|                                                                               |
|  - MongoDB Document Store                                                     |
|  - Collections: Users, Movies, Theatres, Shows, Bookings                      |
|  - Indexing: Compound indices on (movieId, showDate) and (theatreId, showDate)|
+-------------------------------------------------------------------------------+
```

---

## 8. Entity-Relationship (ER) Diagram & Schema

```
  +------------------+                   +--------------------+
  |      USER        |                   |       MOVIE        |
  +------------------+                   +--------------------+
  | _id (PK)         | 1               1 | _id (PK)           |
  | name             |                   | title              |
  | email (Unique)   |                   | genre[]            |
  | passwordHash     |                   | language           |
  | role             |                   | duration           |
  | createdAt        |                   | posterUrl, banner  |
  +--------+---------+                   +---------+----------+
           | 1                                     | 1
           | creates                               | scheduled in
           |                                       |
           v N                                     v N
  +--------+---------+                   +---------+----------+                   +------------------+
  |     BOOKING      |                   |        SHOW        |                   |     THEATRE      |
  +------------------+                   +--------------------+                   +------------------+
  | _id (PK)         | N               1 | _id (PK)           | N               1 | _id (PK)         |
  | bookingReference |------------------>| movieId (FK)       |<------------------| name             |
  | userId (FK)      |                   | theatreId (FK)     |    hosted at      | location, city   |
  | showId (FK)      |                   | showDate, startTime|                   | address          |
  | selectedSeats[]  |                   | format (IMAX/4DX)  |                   | screens[]        |
  | subtotal, total  |                   | pricing {VIP,Prem} |                   | facilities[]     |
  | bookingStatus    |                   | bookedSeats[]      |                   +------------------+
  +------------------+                   +--------------------+
```

### Data Dictionary

#### 1. Users Collection
- `_id`: String / ObjectId — Primary Key.
- `name`: String — User's full name.
- `email`: String (Indexed, Unique) — Account login identifier.
- `passwordHash`: String — BCrypt salted hash (Cost factor: 10).
- `role`: Enum (`'user'` | `'admin'`) — Access control tag.

#### 2. Shows Collection
- `_id`: String / ObjectId — Primary Key.
- `movieId`: ObjectId — Foreign Key referencing Movie.
- `theatreId`: ObjectId — Foreign Key referencing Theatre.
- `screenNumber`: Number — Auditorium number.
- `format`: String — Cinema format (IMAX 3D, Dolby Cinema, 4DX, 2D).
- `showDate`: String (YYYY-MM-DD) — Date of show.
- `startTime`: String — E.g. "07:30 PM".
- `pricing`: Object — `{ VIP: Number, Premium: Number, Standard: Number }`.
- `bookedSeats`: Array of Strings — List of currently reserved seat IDs (e.g. `["C4", "C5"]`).
- `blockedSeats`: Array of Strings — List of maintenance blocked seats.

#### 3. Bookings Collection
- `_id`: String / ObjectId — Primary Key.
- `bookingReference`: String (Indexed, Unique) — E.g. `IMV-948201`.
- `userId`: ObjectId — Foreign Key referencing User.
- `showId`: ObjectId — Foreign Key referencing Show.
- `selectedSeats`: Array of Strings — E.g. `["C4", "C5"]`.
- `subtotal`: Number — Sum of base seat prices.
- `convenienceFee`: Number — ₹25 per ticket.
- `tax`: Number — 5% Entertainment tax.
- `totalAmount`: Number — Grand total charged.
- `bookingStatus`: Enum (`'confirmed'` | `'cancelled'`).

---

## 9. Data Flow Diagrams (DFD)

### Level 0 DFD (Context Diagram)
```
                  [ Registration / Credentials ]
[ Customer ] -----------------------------------------> ( 0.0 IMOVIES SYSTEM )
             <-----------------------------------------
                  [ JWT Token / Available Shows ]
                                                               |
                  [ Select Seats & Pay ]                       | Database
[ Customer ] ----------------------------------------->        | Read / Write
             <-----------------------------------------        v
                  [ Printable E-Ticket (Pass) ]          [( MongoDB Store )]
                                                               ^
                  [ Add Movie / Schedule Show ]                |
[ Admin ]    ----------------------------------------->        |
             <-----------------------------------------        |
                  [ Real-time KPIs & Audit Log ]
```

### Level 1 DFD (Detailed Processing)
1. **Process 1.0 (Authentication):** Customer submits credentials; server verifies BCrypt hash against Users collection; returns signed JWT token.
2. **Process 2.0 (Catalogue Query):** Customer browses movies; server queries Movie & Show collections for matching dates and theatre locations.
3. **Process 3.0 (Seat Availability Check):** Customer picks a show; server compiles full seat grid, marking seats in `bookedSeats` or `blockedSeats` as disabled.
4. **Process 4.0 (Atomic Checkout):** Customer selects seats and submits payment; server locks `showId`, validates seats, pushes seats to `bookedSeats`, calculates financials, and creates `Booking` document.
5. **Process 5.0 (Cancellation & Restocking):** Customer requests cancellation; server unlocks seats, removes them from `bookedSeats`, marks booking as `'cancelled'`, and issues refund.

---

## 10. Concurrency Control & Double-Booking Protection

One of the most critical aspects of cinema ticketing is **preventing race conditions**.

### The Concurrency Vulnerability:
If Customer A and Customer B both select seat **C4** at the exact same millisecond:
1. Thread A checks if **C4** is booked -> No.
2. Thread B checks if **C4** is booked -> No.
3. Thread A reserves **C4**.
4. Thread B reserves **C4**.
*Result:* Both users pay for the exact same seat (Double Booking!).

### IMovies Architectural Solution:
IMovies uses a **per-show asynchronous mutex lock** pattern (`withShowLock`):
```typescript
public async withShowLock<T>(showId: string, fn: () => Promise<T>): Promise<T> {
  const existingLock = this.reservationLocks.get(showId) || Promise.resolve();
  let releaseLock: () => void = () => {};
  const newLock = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });

  this.reservationLocks.set(showId, existingLock.then(() => newLock));

  try {
    await existingLock;
    return await fn();
  } finally {
    releaseLock();
  }
}
```
Inside the lock:
1. The server re-reads the fresh `bookedSeats` array.
2. If ANY selected seat is already present in `bookedSeats`, the entire transaction is rejected with **HTTP 409 Conflict**.
3. If all seats are free, they are appended atomically, and the booking document is written.

---

## 11. RESTful API Documentation

| HTTP Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register user account with hashed password |
| **POST** | `/api/auth/login` | Public | Authenticate user & return signed JWT |
| **GET** | `/api/auth/me` | Authenticated | Retrieve current user profile |
| **GET** | `/api/movies` | Public | List movies (filtered by status, genre, sort) |
| **GET** | `/api/movies/:id` | Public | Fetch movie details with upcoming shows |
| **POST** | `/api/movies` | Admin Only | Create a new movie entry |
| **PUT** | `/api/movies/:id` | Admin Only | Update movie metadata |
| **DELETE** | `/api/movies/:id` | Admin Only | Delete movie and cascade show removal |
| **GET** | `/api/theatres` | Public | List theatres across cities |
| **GET** | `/api/shows` | Public | Query shows by movieId, theatreId, date |
| **GET** | `/api/shows/:id/seats`| Public | Fetch live 72-seat layout with pricing |
| **POST** | `/api/shows` | Admin Only | Schedule a new showtime |
| **POST** | `/api/bookings` | Authenticated | Atomically book tickets & verify seats |
| **GET** | `/api/bookings/my` | Authenticated | Fetch authenticated user's ticket history |
| **PATCH**| `/api/bookings/:id/cancel`| Authenticated | Cancel booking & release seats |
| **GET** | `/api/admin/dashboard`| Admin Only | Retrieve box office KPIs & revenue metrics |
| **POST** | `/api/admin/reset` | Admin Only | Reseed database back to default state |

---

## 12. Verification & Test Suite Report

| Test Case | Module | Input / Action | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Auth | Register new user | Returns HTTP 201 + valid JWT token | **PASSED** |
| **TC-02** | Auth | Register with existing email | Returns HTTP 400 "Email already exists" | **PASSED** |
| **TC-03** | Auth | Login with incorrect password | Returns HTTP 401 "Invalid email or password" | **PASSED** |
| **TC-04** | Booking | Select 2 available seats & pay | Returns HTTP 201 + unique reference IMV-XXXX | **PASSED** |
| **TC-05** | Booking | Attempt booking already reserved seat | Returns HTTP 409 Conflict with seat list | **PASSED** |
| **TC-06** | Booking | Attempt selecting > 8 seats | Frontend blocks with alert message | **PASSED** |
| **TC-07** | Cancel | Cancel confirmed booking | Seats released in DB, refund recorded | **PASSED** |
| **TC-08** | Admin | Non-admin accesses `/api/admin/*` | Returns HTTP 403 Forbidden | **PASSED** |

---

## 13. Limitations & Future Enhancements

### Current Limitations:
- Payment is currently a simulated payment gateway (realistic checkout flow with card, UPI, and net banking validation, but without charging real credit cards).
- Fixed 72-seat layout per screen (Rows A to H, 9 seats per row).

### Future Enhancements:
- Integration with live payment gateways (Razorpay, Stripe, or PayPal).
- Cinema Hall Seat Designer allowing administrators to visually configure custom seat counts and wheelchair bays.
- Automated email / SMS dispatch with attached PDF ticket and barcode scanning integration.
- Dynamic surge pricing based on real-time occupancy algorithms.

---

## 14. Viva Voce Preparation Guide (Questions & Answers)

**Q1: What architecture pattern does IMovies implement?**  
*Answer:* It follows a Three-Tier Client-Server Architecture. The client layer is a React 19 Single Page Application (SPA), the middle layer is a Node.js Express REST API server, and the persistence layer is a MongoDB document database managed via Mongoose schemas.

**Q2: How do you prevent two customers from reserving the same seat simultaneously?**  
*Answer:* We implement server-side atomic locking (`withShowLock`) on the specific show ID. When a reservation request arrives, the server enters an atomic synchronized block, validates that none of the selected seats are present in `bookedSeats`, and writes the reservation before releasing the lock. If a conflict occurs, it returns HTTP 409 Conflict.

**Q3: Why is price calculation performed on the backend rather than accepting frontend totals?**  
*Answer:* Security. Client-side payloads can be inspected and manipulated using browser developer tools or HTTP clients like Postman. The server always queries the authorized price per tier (VIP, Premium, Standard), calculates taxes (5% GST), and computes convenience fees independently.

**Q4: How does JWT authentication work in this app?**  
*Answer:* Upon successful login or registration, the server signs a JSON Web Token containing the user's ID, email, and role using a cryptographic secret key (`JWT_SECRET`). The client stores this in `localStorage` and includes it in the `Authorization: Bearer <token>` header for protected endpoints. The server verifies this token using middleware (`requireAuth` and `requireAdmin`).

---
*IMovies Technical Documentation — Prepared for Final Year B.Tech Academic Submission.*
