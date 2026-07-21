import React from 'react';
import { LogOut } from 'lucide-react';
import { School } from '../../../types';

interface SchoolHeaderProps {
  school: School;
  onLogout: () => void;
}

export default function SchoolHeader({ school, onLogout }: SchoolHeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shrink-0 relative z-30 font-sans">
      {/* Left Column: Logo & School Info */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="bg-white p-1 px-1.5 sm:px-2 rounded-xl border border-slate-100 shadow-sm flex items-center shrink-0">
          <img src="/logo.png?v=3" alt="Enfinite Logo" className="h-8 sm:h-10 w-auto object-contain" />
        </div>
        <div className="pl-2 sm:pl-3.5 border-l border-slate-200">
          <h2 className="text-xs font-black font-display text-slate-900 truncate max-w-[140px] sm:max-w-none">{school.name}</h2>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono tracking-wider font-semibold uppercase">
            COORD PANEL • {school.id}
          </p>
        </div>
      </div>

      {/* Centered Heading */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center select-none text-center pointer-events-none">
        <span className="text-sm lg:text-base font-black tracking-widest text-slate-800 font-display uppercase bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
          Enfinite National Olympiad
        </span>
      </div>

      {/* Right Column: Approval Badge & Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Status: Approved
        </span>
        <button 
          id="btn-school-logout"
          onClick={onLogout} 
          className="flex items-center gap-1 sm:gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-bold text-xs rounded-xl transition cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
