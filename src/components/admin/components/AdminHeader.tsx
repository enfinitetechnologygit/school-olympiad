import React from 'react';
import { X } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shrink-0 relative z-30 font-sans">
      {/* Left Column: Logo & Admin Info */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="bg-white p-1 px-1.5 sm:px-2 rounded-xl border border-slate-100 shadow-sm flex items-center shrink-0">
          <img src="/logo.png?v=3" alt="Enfinite Logo" className="h-8 sm:h-10 w-auto object-contain" />
        </div>
        <div className="pl-2 sm:pl-3.5 border-l border-slate-200">
          <h2 className="text-[10px] sm:text-xs font-black font-display text-slate-900">ADMIN CONTROL</h2>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Delhi HQ Office</p>
        </div>
      </div>

      {/* Centered Heading */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center select-none text-center pointer-events-none">
        <span className="text-sm lg:text-base font-black tracking-widest text-slate-800 font-display uppercase bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
          Enfinite National Olympiad
        </span>
      </div>

      {/* Right Column: Logout Action */}
      <button 
        id="btn-admin-logout"
        onClick={onLogout} 
        className="flex items-center gap-1 sm:gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-bold text-xs rounded-xl transition cursor-pointer active:scale-95 whitespace-nowrap"
      >
        <X className="w-3.5 h-3.5 text-rose-600" />
        <span>Exit<span className="hidden sm:inline"> Control Panel</span></span>
      </button>
    </header>
  );
}
