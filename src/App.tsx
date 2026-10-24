/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { LocationProvider } from './context/LocationContext.tsx';
import { Movie, Show } from './types/index.ts';

import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ProjectDocsModal } from './components/ProjectDocsModal.tsx';
import { LocationModal } from './components/LocationModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { MoviesPage } from './pages/MoviesPage.tsx';
import { MovieDetailsPage } from './pages/MovieDetailsPage.tsx';
import { BookingPage } from './pages/BookingPage.tsx';
import { MyBookingsPage } from './pages/MyBookingsPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { TheatresPage } from './pages/TheatresPage.tsx';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [bookingShow, setBookingShow] = useState<Show | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [docsModalOpen, setDocsModalOpen] = useState<boolean>(false);

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentView('movie-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentView('movie-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectShow = (show: Show) => {
    setBookingShow(show);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingComplete = () => {
    setCurrentView('my-bookings');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-800 flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900">
      {/* Top Navbar with Location Selector Button */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenDocs={() => setDocsModalOpen(true)}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onSelectMovie={handleSelectMovie}
            onBookMovie={handleBookMovie}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentView === 'movies' && (
          <MoviesPage
            onSelectMovie={handleSelectMovie}
            onBookMovie={handleBookMovie}
          />
        )}

        {currentView === 'movie-details' && selectedMovie && (
          <MovieDetailsPage
            movie={selectedMovie}
            onBack={() => setCurrentView('home')}
            onSelectShow={handleSelectShow}
          />
        )}

        {currentView === 'theatres' && (
          <TheatresPage
            onSelectMovieForBooking={() => setCurrentView('movies')}
          />
        )}

        {currentView === 'booking' && bookingShow && (
          <BookingPage
            show={bookingShow}
            onBack={() => setCurrentView('movie-details')}
            onOpenAuth={() => handleOpenAuth('login')}
            onBookingComplete={handleBookingComplete}
          />
        )}

        {currentView === 'my-bookings' && (
          <MyBookingsPage
            onExploreMovies={() => setCurrentView('movies')}
          />
        )}

        {currentView === 'admin' && <AdminDashboardPage />}
      </main>

      {/* Global Footer */}
      <Footer
        onOpenDocs={() => setDocsModalOpen(true)}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Location Modal */}
      <LocationModal />

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal
          initialTab={authInitialTab}
          onClose={() => setAuthModalOpen(false)}
        />
      )}

      {/* College Project Documentation Modal */}
      {docsModalOpen && (
        <ProjectDocsModal
          onClose={() => setDocsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LocationProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LocationProvider>
  );
}
