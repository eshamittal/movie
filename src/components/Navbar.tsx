import React, { useState } from 'react';
import { Film, Ticket, Shield, BookOpen, LogOut, ChevronDown, MapPin, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLocation } from '../context/LocationContext.tsx';

interface NavbarProps {
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onOpenDocs: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenDocs,
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
}) => {
  const { user, isAdmin, logout, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const { selectedCity, setIsLocationModalOpen } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo & Location Selector Button */}
          <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-2.5 group text-left focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 flex items-center justify-center shadow-md shadow-rose-200/50 group-hover:scale-105 transition-transform duration-200">
                <Film className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                  I<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">MOVIES</span>
                </span>
                <span className="block text-[9px] tracking-wider uppercase text-slate-500 font-semibold -mt-1">
                  Pastel Cinema
                </span>
              </div>
            </button>

            {/* LOCATION BUTTON (Prominent City Selector) */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/80 text-xs font-bold text-rose-800 transition-all hover:scale-102 active:scale-98 shadow-xs cursor-pointer group"
              title="Change your current cinema city"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500 group-hover:animate-bounce" />
              <span className="max-w-[90px] sm:max-w-[120px] truncate">{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-rose-400" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  currentView === 'home'
                    ? 'text-rose-700 bg-rose-50/90 border border-rose-200/70 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Now Showing
              </button>
              <button
                onClick={() => setCurrentView('movies')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  currentView === 'movies'
                    ? 'text-rose-700 bg-rose-50/90 border border-rose-200/70 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                All Movies
              </button>
              <button
                onClick={() => setCurrentView('theatres')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  currentView === 'theatres'
                    ? 'text-rose-700 bg-rose-50/90 border border-rose-200/70 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Theatres
              </button>
              {user && (
                <button
                  onClick={() => setCurrentView('my-bookings')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'my-bookings'
                      ? 'text-pink-700 bg-pink-50 border border-pink-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5 text-pink-500" />
                  My Bookings
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'admin'
                      ? 'text-amber-800 bg-amber-50 border border-amber-200 shadow-xs'
                      : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/60'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  Admin Panel
                </button>
              )}
            </nav>
          </div>

          {/* Right Side: Docs, Demo Switcher, User Auth */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* College Docs Button */}
            <button
              onClick={onOpenDocs}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/70 hover:bg-indigo-100 transition-all shadow-xs cursor-pointer"
              title="View full College B.Tech documentation, ERD, DFD, & Viva Questions"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Project Docs & Viva</span>
            </button>

            {/* Quick Demo Switcher */}
            <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400">Demo:</span>
              <button
                onClick={loginAsDemoUser}
                className="px-2 py-0.5 rounded-lg hover:bg-white hover:text-slate-800 font-medium transition-colors cursor-pointer"
                title="Switch to Demo User"
              >
                User
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={loginAsDemoAdmin}
                className="px-2 py-0.5 rounded-lg text-amber-700 hover:bg-amber-50 font-bold transition-colors cursor-pointer"
                title="Switch to Administrator"
              >
                Admin
              </button>
            </div>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-xs text-slate-800 font-bold cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  {isAdmin && (
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-rose-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400 font-medium">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('my-bookings');
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50/70 hover:text-rose-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5 text-rose-500" />
                      My Bookings
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-500" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onOpenDocs();
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      Project Report & Viva
                    </button>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-900 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 hover:from-rose-500 hover:to-amber-400 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-100 bg-white px-4 pt-2 pb-6 space-y-2">
          {/* Mobile Location Selector Button */}
          <div className="pb-2 border-b border-slate-100">
            <button
              onClick={() => {
                setIsLocationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Cinema City: <strong>{selectedCity}</strong></span>
              </div>
              <span className="text-[10px] text-rose-600 underline">Change</span>
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700"
          >
            Now Showing
          </button>
          <button
            onClick={() => {
              setCurrentView('movies');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700"
          >
            All Movies
          </button>
          <button
            onClick={() => {
              setCurrentView('theatres');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700"
          >
            Theatres in {selectedCity}
          </button>
          {user && (
            <button
              onClick={() => {
                setCurrentView('my-bookings');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-pink-700 hover:bg-pink-50 flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              My Bookings
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-800 hover:bg-amber-50 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </button>
          )}
          <button
            onClick={() => {
              onOpenDocs();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-50 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            College Project Docs & Viva
          </button>
        </div>
      )}
    </header>
  );
};
