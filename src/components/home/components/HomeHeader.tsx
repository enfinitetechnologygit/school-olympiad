import React from 'react';
import { Sparkles, Cpu, BookOpen, School as SchoolIcon } from 'lucide-react';

interface HomeHeaderProps {
  onOpenModal: (type: 'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister') => void;
}

export default function HomeHeader({ onOpenModal }: HomeHeaderProps) {
  return (
    <>
      {/* Premium Notification Ticker */}
      <div className="bg-blue-600 text-white text-xs py-2 px-4 font-semibold text-center tracking-wider uppercase flex items-center justify-center gap-2 no-print">
        <Sparkles className="w-4.5 h-4.5 animate-pulse text-yellow-300" />
        <span>Registration ends July 15, 2026. Stage 1 National Pre-Exams on July 30, 2026.</span>
      </div>

      {/* High-fidelity Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950 font-display">
              Enfinite National <span className="text-blue-600">Olympiad</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
              Computer Science • Class 5th - 12th
            </p>
          </div>
        </div>

        {/* Global Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition">Process</a>
          <a href="#syllabus-section" className="text-slate-600 hover:text-blue-650 hover:text-blue-600 transition flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest text-[9px]">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Syllabus
          </a>
          <a href="#agenda-section" className="text-slate-600 hover:text-blue-600 transition">Dates</a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          <button 
            id="btn-school-login-nav"
            onClick={() => onOpenModal('schoolLogin')} 
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold text-sm transition bg-white cursor-pointer"
          >
            <SchoolIcon className="w-4 h-4 text-slate-500" />
            School Login
          </button>
          
          <button 
            id="btn-student-login-nav"
            onClick={() => onOpenModal('studentLogin')} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-blue-100 transition cursor-pointer"
          >
            Student Login
          </button>

          {/* Quick Admin backdoor */}
          <button 
            id="btn-admin-portal-backdoor"
            onClick={() => onOpenModal('adminLogin')} 
            className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-wider underline cursor-pointer ml-1"
          >
            Admin Portal
          </button>
        </div>
      </header>
    </>
  );
}
