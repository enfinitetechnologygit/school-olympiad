import React from 'react';
import { School as SchoolIcon, LogOut } from 'lucide-react';
import { School } from '../../../types';

interface SchoolHeaderProps {
  school: School;
  onLogout: () => void;
}

export default function SchoolHeader({ school, onLogout }: SchoolHeaderProps) {
  return (
    <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 relative">
      <div className="flex items-center gap-3">
        <img src="/logo.png?v=3" alt="Enfinite Logo" className="h-10 w-auto object-contain" />
        <div className="pl-3 border-l border-slate-800">
          <h2 className="text-xs font-bold font-display text-white">{school.name}</h2>
          <p className="text-[9px] text-slate-400 font-mono tracking-wider">BOARD APPROVED SCHOOL COORD PANEL • ID: {school.id}</p>
        </div>
      </div>

      {/* Centered Heading */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center select-none font-cinzel leading-none text-center pointer-events-none">
        <span className="text-base lg:text-lg font-extrabold tracking-widest text-slate-100 uppercase">
          Enfinite National Olympiad
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
          Status: Approved
        </span>
        <button 
          id="btn-school-logout"
          onClick={onLogout} 
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 px-3 py-1.5 text-white font-bold text-xs rounded-lg transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
}
