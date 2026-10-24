import React, { useState } from 'react';
import { BookOpen, Database, GitMerge, FileCode, CheckSquare, HelpCircle, Layers, Copy, Check } from 'lucide-react';

interface ProjectDocsModalProps {
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'architecture' | 'erd' | 'dfd' | 'api' | 'testing' | 'viva'
  >('overview');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-rose-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-4">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-50/80 via-pink-50/60 to-indigo-50/50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                IMovies — College Project Documentation & Viva Guide
              </h2>
              <p className="text-xs text-slate-500">
                B.Tech Computer Science & Engineering Capstone Project Deliverable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs in Pastel */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: '1. Abstract & Scope', icon: Layers },
            { id: 'architecture', label: '2. Architecture', icon: GitMerge },
            { id: 'erd', label: '3. ER Diagram & Schema', icon: Database },
            { id: 'dfd', label: '4. DFD & Use Cases', icon: FileCode },
            { id: 'api', label: '5. REST APIs & Postman', icon: FileCode },
            { id: 'testing', label: '6. Test Cases', icon: CheckSquare },
            { id: 'viva', label: '7. Viva Voce Q&A', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* TAB 1: ABSTRACT & SCOPE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <section className="bg-rose-50/40 p-5 rounded-2xl border border-rose-100 space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Project Abstract
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The <strong>IMovies Online Movie Ticket Booking System</strong> is a full-stack, distributed web application built to modernize cinema ticketing and streamline multiplex operations. Conventional ticketing setups suffer from high queuing latency, vulnerability to concurrent double-booking, and inflexible pricing structures. IMovies resolves these limitations by orchestrating a <strong>React SPA frontend</strong>, an <strong>Express.js / Node.js RESTful API engine</strong>, and a <strong>MongoDB / Mongoose persistence layer</strong>, complemented by server-side atomic locking to guarantee zero race-condition seat conflicts.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider">Problem Statement</h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Long physical queues and operational overhead at box office counters.</li>
                    <li>Double booking hazards when two users attempt reserving identical seats concurrently.</li>
                    <li>Lack of dynamic, multi-tier pricing (VIP Loungers, Premium, Standard) based on screen format (IMAX, 4DX, Dolby).</li>
                    <li>Inefficient cancellation and seat-release reconciliation in legacy systems.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Proposed Solution</h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>24/7 responsive booking interface accessible on desktop and mobile browsers.</li>
                    <li>Atomic mutex seat locking with HTTP 409 conflict notifications.</li>
                    <li>Interactive SVG curved-screen seat matrix with tier-differentiated pricing.</li>
                    <li>Automated cancellation window with immediate seat inventory restocking.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Functional Modules</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-slate-900 block font-bold">1. Auth Module</strong>
                    <span className="text-[11px] text-slate-500">JWT, BCrypt hash, RBAC</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-slate-900 block font-bold">2. Catalogue Module</strong>
                    <span className="text-[11px] text-slate-500">Now-showing, filters, trailers</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-slate-900 block font-bold">3. Booking Engine</strong>
                    <span className="text-[11px] text-slate-500">Seat locks, GST, E-Tickets</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-slate-900 block font-bold">4. Admin Dashboard</strong>
                    <span className="text-[11px] text-slate-500">KPIs, show scheduler, seat blocking</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900">Three-Tier Client-Server Architecture</h3>
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto leading-relaxed shadow-xs">
                <pre>{`
+---------------------------------------------------------------------------------------+
|                                PRESENTATION LAYER (CLIENT)                             |
|                                                                                       |
|   React 19 + TypeScript + Vite SPA                                                    |
|   +-------------------+  +--------------------+  +------------------+                 |
|   | Movie & Shows UI  |  | Seat Selection Map |  | Checkout & Ticket|                 |
|   +-------------------+  +--------------------+  +------------------+                 |
|                     ^                         ^                                        |
|                     |                         |                                        |
|                     +-----------+-------------+                                        |
|                                 | JSON / REST / JWT via Fetch                          |
+---------------------------------|-----------------------------------------------------+
                                  |
                                  v
+---------------------------------------------------------------------------------------+
|                             APPLICATION LAYER (EXPRESS SERVER)                        |
|                                                                                       |
|   Node.js + Express.js API Gateway (Port 3000)                                        |
|   +--------------------+  +---------------------+  +-------------------------------+  |
|   | Auth Middleware    |  | Atomic Lock Mutex   |  | Tax & Fee Calculation Engine  |  |
|   | (JWT + Role Check) |  | (Anti-Race Locking) |  | (Never Trusts Frontend Price) |  |
|   +--------------------+  +---------------------+  +-------------------------------+  |
|   Controllers:                                                                        |
|   - authController     - movieController      - theatreController                     |
|   - showController     - bookingController    - adminController                       |
+---------------------------------|-----------------------------------------------------+
                                  |
                                  v
+---------------------------------------------------------------------------------------+
|                                DATA PERSISTENCE LAYER                                 |
|                                                                                       |
|   MongoDB Database Engine (via Mongoose ODM) with In-Memory Resilient Fallback        |
|   Collections: Users, Movies, Theatres, Shows, Bookings                               |
+---------------------------------------------------------------------------------------+
                `}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">State Management</strong>
                  <p className="text-slate-500">Context API + localStorage for reactive session and location state.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Atomic Seat Locks</strong>
                  <p className="text-slate-500">Prevents concurrent race conditions via Promise chaining on the target showId.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Strict Validation</strong>
                  <p className="text-slate-500">Server recalculates all subtotals, GST, and convenience fees before recording the booking.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ER DIAGRAM & SCHEMA */}
          {activeTab === 'erd' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900">Entity Relationship (ER) Diagram</h3>
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto leading-relaxed shadow-xs">
                <pre>{`
  +------------------+                 +--------------------+
  |      USER        |                 |       MOVIE        |
  +------------------+                 +--------------------+
  | _id (PK)         | 1             1 | _id (PK)           |
  | name             |                 | title              |
  | email (Unique)   |                 | genre[]            |
  | passwordHash     |                 | language           |
  | role (user/admin)|                 | duration           |
  | createdAt        |                 | posterUrl, rating  |
  +--------+---------+                 +---------+----------+
           | 1                                   | 1
           |                                     |
           | creates                             | has
           |                                     |
           v N                                   v N
  +--------+---------+                 +---------+----------+                 +------------------+
  |     BOOKING      |                 |        SHOW        |                 |     THEATRE      |
  +------------------+                 +--------------------+                 +------------------+
  | _id (PK)         | N             1 | _id (PK)           | N             1 | _id (PK)         |
  | bookingRef       |---------------->| movieId (FK)       |<----------------| name             |
  | userId (FK)      |                 | theatreId (FK)     |   hosts at      | location         |
  | showId (FK)      |                 | showDate, startTime|                 | city             |
  | selectedSeats[]  |                 | format (IMAX/3D/2D)|                 | screens[]        |
  | subtotal, total  |                 | pricing {VIP,Prem} |                 | facilities[]     |
  | bookingStatus    |                 | bookedSeats[]      |                 +------------------+
  +------------------+                 +--------------------+
                `}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: DFD & USE CASES */}
          {activeTab === 'dfd' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900">Data Flow Diagram (DFD Level 0 & Level 1)</h3>
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto leading-relaxed shadow-xs">
                <pre>{`
=== LEVEL 0: CONTEXT ANALYSIS DIAGRAM ===

[Guest / Customer] ----(Credentials / Seat Choices / Payment)----> [ 0.0 IMOVIES SYSTEM ]
                   <---(E-Ticket / Confirmation / Seat Layout)----
                                                                          |
[Administrator]    ----(Movie Data / Schedules / Seat Overrides)->        | Reads / Writes
                   <---(Revenue KPIs / Audits / Bookings List)----        v
                                                                   [( MongoDB Storage )]

=== LEVEL 1: DETAILED SYSTEM WORKFLOW ===

[Customer] ---> (1.0 Authentication Engine) ---> Check Credentials against [Users Collection]
                                            ---> Issues signed JWT Bearer Token

[Customer] ---> (2.0 Browse & Filter Shows) ---> Queries [Shows & Movies Collections]
                                            <--- Returns Active Theatres, Showtimes & Pricing

[Customer] ---> (3.0 Select Seats)          ---> Fetch Real-Time Seat Availability
           ---> (4.0 Reserve & Pay)         ---> Acquire Atomic Lock on ShowId
                                                 Verify seats not in bookedSeats[]
                                                 Append seats to bookedSeats[]
                                                 Generate Booking record & Transaction ID
                                            <--- Return E-Ticket with QR Code & Barcode
                `}</pre>
              </div>
            </div>
          )}

          {/* TAB 5: REST APIS & POSTMAN */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">RESTful API Endpoints Specification</h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        {
                          info: { name: 'IMovies REST APIs', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
                          item: [
                            { name: 'Auth - Login', request: { method: 'POST', url: 'http://localhost:3000/api/auth/login' } },
                            { name: 'Movies - Get All', request: { method: 'GET', url: 'http://localhost:3000/api/movies' } },
                            { name: 'Shows - Get Seats', request: { method: 'GET', url: 'http://localhost:3000/api/shows/shw_0001/seats' } },
                            { name: 'Bookings - Create', request: { method: 'POST', url: 'http://localhost:3000/api/bookings' } },
                          ],
                        },
                        null,
                        2
                      )
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Postman JSON!' : 'Copy Postman JSON'}</span>
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold mr-2">POST</span>
                  <span className="text-slate-900 font-bold">/api/auth/register</span>
                  <p className="text-slate-500 font-sans text-[11px] mt-1">Registers new user, hashes password with bcrypt, returns JWT token.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold mr-2">POST</span>
                  <span className="text-slate-900 font-bold">/api/auth/login</span>
                  <p className="text-slate-500 font-sans text-[11px] mt-1">Validates email & password, returns JWT token.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold mr-2">GET</span>
                  <span className="text-slate-900 font-bold">/api/movies</span>
                  <p className="text-slate-500 font-sans text-[11px] mt-1">Returns movies filtered by status (now-showing/upcoming), genre, search.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold mr-2">GET</span>
                  <span className="text-slate-900 font-bold">/api/shows/:id/seats</span>
                  <p className="text-slate-500 font-sans text-[11px] mt-1">Returns 72-seat layout with VIP, Premium, Standard pricing and booked status.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold mr-2">POST</span>
                  <span className="text-slate-900 font-bold">/api/bookings</span>
                  <p className="text-slate-500 font-sans text-[11px] mt-1">Atomically reserves seats. Returns HTTP 409 if any seat is already booked.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold mr-2">PATCH</span>
                  <span className="text-slate-900 font-bold">/api/bookings/:id/cancel</span>
                  <p className="text-slate-500 font-sans text-[11px] mt-1">Cancels booking and releases seats back into availability pool.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TEST CASES */}
          {activeTab === 'testing' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Verification & Test Suite Scenarios</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="p-3 border-b border-slate-200">Test ID</th>
                      <th className="p-3 border-b border-slate-200">Scenario Description</th>
                      <th className="p-3 border-b border-slate-200">Expected Result</th>
                      <th className="p-3 border-b border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                    <tr>
                      <td className="p-3 font-mono font-bold text-slate-900">TC-01</td>
                      <td className="p-3">User registration with unique email</td>
                      <td className="p-3">HTTP 201 Created + signed JWT</td>
                      <td className="p-3 text-emerald-600 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-slate-900">TC-02</td>
                      <td className="p-3">Registration with duplicate email</td>
                      <td className="p-3">HTTP 400 Bad Request ("Email already exists")</td>
                      <td className="p-3 text-emerald-600 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-slate-900">TC-03</td>
                      <td className="p-3">Invalid password login attempt</td>
                      <td className="p-3">HTTP 401 Unauthorized</td>
                      <td className="p-3 text-emerald-600 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-slate-900">TC-04</td>
                      <td className="p-3">Selecting available seats and booking</td>
                      <td className="p-3">HTTP 201 Created + E-Ticket generated</td>
                      <td className="p-3 text-emerald-600 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-slate-900">TC-05</td>
                      <td className="p-3">Concurrent booking of the same seat</td>
                      <td className="p-3">HTTP 409 Conflict ("Seat already booked")</td>
                      <td className="p-3 text-emerald-600 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-slate-900">TC-06</td>
                      <td className="p-3">Cancelling eligible booking</td>
                      <td className="p-3">Seats unblocked, status refunded</td>
                      <td className="p-3 text-emerald-600 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-slate-900">TC-07</td>
                      <td className="p-3">Non-admin accessing /api/admin/dashboard</td>
                      <td className="p-3">HTTP 403 Forbidden ("Admin role required")</td>
                      <td className="p-3 text-emerald-600 font-bold">PASS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: VIVA VOCE Q&A */}
          {activeTab === 'viva' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">B.Tech Viva Voce Questions & Model Answers</h3>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <p className="font-bold text-rose-800">
                    Q1: How does the system prevent double-booking when multiple users click "Pay" at the exact same millisecond?
                  </p>
                  <p className="text-slate-600">
                    <strong>Answer:</strong> We implement an <em>atomic reservation mutex lock</em> on the backend keyed by the unique <code>showId</code>. When a booking request arrives, the server evaluates seat availability inside this synchronized transaction. If any selected seat exists in <code>bookedSeats</code>, the transaction is rejected immediately with an HTTP 409 Conflict response.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <p className="font-bold text-rose-800">
                    Q2: Why do you calculate the ticket price, convenience fee, and taxes on the backend rather than reading them from the frontend?
                  </p>
                  <p className="text-slate-600">
                    <strong>Answer:</strong> Frontend client data cannot be trusted. A malicious user could tamper with the HTTP request payload and change a ₹450 ticket to ₹1. The backend reads each seat ID, looks up its row tier (VIP, Premium, Standard), multiplies by the authorized show rates, and independently calculates taxes and convenience fees.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <p className="font-bold text-rose-800">
                    Q3: How are passwords secured and how does JWT authentication function?
                  </p>
                  <p className="text-slate-600">
                    <strong>Answer:</strong> Passwords are never stored in plaintext. We hash them using <code>bcryptjs</code> with a salt factor of 10. During login, <code>bcrypt.compare()</code> validates the password, and upon success, a signed JSON Web Token (JWT) containing the user ID, email, and role is returned and transmitted via the <code>Authorization: Bearer &lt;token&gt;</code> header.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
