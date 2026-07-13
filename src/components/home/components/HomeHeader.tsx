import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, BookOpen, School as SchoolIcon } from 'lucide-react';

interface HomeHeaderProps {
  onOpenModal: (type: 'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister') => void;
}

export default function HomeHeader({ onOpenModal }: HomeHeaderProps) {
  const [headerText, setHeaderText] = useState<string>('');

  useEffect(() => {
    fetch('/api/announcements/header')
      .then(res => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return res.json();
        }
        throw new Error("Invalid response content-type");
      })
      .then(data => {
        if (data && data.text) {
          setHeaderText(data.text);
        }
      })
      .catch(err => console.warn("Error fetching header announcement (using fallback):", err.message));
  }, []);

  return (
    <>
      {/* Premium Notification Ticker */}
      {headerText && (
        <div className="bg-blue-600 text-white text-xs py-2 px-4 font-semibold text-center tracking-wider uppercase flex items-center justify-center gap-2 no-print">
          <Sparkles className="w-4.5 h-4.5 animate-pulse text-yellow-300" />
          <span>{headerText}</span>
        </div>
      )}

      {/* High-fidelity Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between no-print relative">
        <div className="flex items-center shrink-0">
          <img src="/logo.png?v=3" alt="Enfinite Logo" className="h-12 md:h-14 w-auto object-contain" />
        </div>

        {/* Centered Navigation Links */}
        <nav className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition">Process</a>
          <a href="#syllabus-section" className="text-slate-600 hover:text-blue-650 hover:text-blue-600 transition flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest text-[9px]">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Syllabus
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 z-10">
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
