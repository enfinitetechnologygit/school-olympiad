import React from 'react';
import { Settings, X } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2.5 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <h2 className="text-base font-bold font-display text-white">NATIONAL OLYMPIAD BOARD</h2>
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Superadmin Control Matrix • Delhi HQ Office</p>
        </div>
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
