import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Student } from '../../../types';

interface StudentHeaderProps {
  student: Student;
  onLogout: () => void;
}

export default function StudentHeader({ student, onLogout }: StudentHeaderProps) {
  return (
    <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 no-print relative">
      <div className="flex items-center gap-3">
        <img src="/logo.png?v=3" alt="Enfinite Logo" className="h-10 w-auto object-contain" />
        <div className="pl-3 border-l border-slate-800">
          <h2 className="text-xs font-bold font-display text-white">STUDENT PORTAL CHANNEL</h2>
          <p className="text-[9px] text-slate-400 font-mono">Welcome back, {student.name} ({student.id})</p>
        </div>
      </div>

      {/* Centered Heading */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center select-none font-cinzel leading-none text-center pointer-events-none">
        <span className="text-base lg:text-lg font-extrabold tracking-widest text-slate-100 uppercase">
          Enfinite National Olympiad
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline-block text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
          Current Stage: <strong className="text-white">Stage 1 Pre-Exam ({student.schoolName})</strong>
        </span>
        <button 
          id="btn-student-logout"
          onClick={onLogout} 
          className="flex items-center gap-1 bg-red-600 hover:bg-red-500 px-3 py-1.5 text-white font-bold text-xs rounded-lg transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
}
