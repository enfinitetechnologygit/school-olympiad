import React from 'react';
import { Settings, X } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 relative">
      <div className="flex items-center gap-3">
        <img src="/logo.png?v=3" alt="Enfinite Logo" className="h-10 w-auto object-contain" />
        <div className="pl-3 border-l border-slate-800">
          <h2 className="text-xs font-bold font-display text-white">NATIONAL OLYMPIAD BOARD</h2>
          <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Superadmin Control Matrix • Delhi HQ Office</p>
        </div>
      </div>

      {/* Centered Heading */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center select-none font-cinzel leading-none text-center pointer-events-none">
        <span className="text-base lg:text-lg font-extrabold tracking-widest text-slate-100 uppercase">
          Enfinite National Olympiad
        </span>
      </div>

      <button 
        id="btn-admin-logout"
        onClick={onLogout} 
        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 px-3 py-1.5 text-white font-bold text-xs rounded-lg transition"
      >
        <X className="w-3.5 h-3.5" />
        Logout Control Panel
      </button>
    </header>
  );
}
