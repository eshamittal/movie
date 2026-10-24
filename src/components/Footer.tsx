import React from 'react';
import { Film, Heart, ShieldCheck, MapPin } from 'lucide-react';
import { useLocation } from '../context/LocationContext.tsx';

interface FooterProps {
  onOpenDocs: () => void;
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs, setCurrentView }) => {
  const { selectedCity, setIsLocationModalOpen } = useLocation();

  return (
    <footer className="bg-white border-t border-rose-100/80 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 flex items-center justify-center shadow-xs">
                <Film className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                I<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">MOVIES</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Pastel-themed Cinema Ticketing Web Platform. Built for B.Tech Capstone Project with real-time atomic seat locks, tiered multiplex pricing, JWT authentication, and interactive city selection.
            </p>
            <div className="pt-1 flex flex-wrap gap-2">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-800 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Selected City: {selectedCity}</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-xs tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-rose-600 transition-colors cursor-pointer">
                  Now Showing Movies
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('movies')} className="hover:text-rose-600 transition-colors cursor-pointer">
                  Browse All Releases
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('theatres')} className="hover:text-rose-600 transition-colors cursor-pointer">
                  Theatres & Formats (IMAX, 4DX)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('my-bookings')} className="hover:text-rose-600 transition-colors cursor-pointer">
                  My Ticket History
                </button>
              </li>
            </ul>
          </div>

          {/* College Project Deliverables */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-xs tracking-wider uppercase">Academic Submission</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={onOpenDocs} className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5 font-bold cursor-pointer">
                  Project Report & Abstract
                </button>
              </li>
              <li>
                <button onClick={onOpenDocs} className="hover:text-slate-900 transition-colors cursor-pointer">
                  System Architecture & DFD
                </button>
              </li>
              <li>
                <button onClick={onOpenDocs} className="hover:text-slate-900 transition-colors cursor-pointer">
                  ER Diagram & Schemas
                </button>
              </li>
              <li>
                <button onClick={onOpenDocs} className="hover:text-slate-900 transition-colors cursor-pointer">
                  Viva Voce Questions & Answers
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-xs tracking-wider uppercase">Technology Stack</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Frontend</p>
                <p className="text-slate-800 font-bold">React 19 + Vite</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Backend</p>
                <p className="text-slate-800 font-bold">Node.js + Express</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Database</p>
                <p className="text-slate-800 font-bold">MongoDB Mongoose</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Styling</p>
                <p className="text-slate-800 font-bold">Pastel Tailwind</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} IMovies Cinema Management System. Prepared for B.Tech Final Year Evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Soft Pastel Design
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
