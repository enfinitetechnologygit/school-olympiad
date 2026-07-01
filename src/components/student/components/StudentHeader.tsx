import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Student } from '../../../types';

interface StudentHeaderProps {
  student: Student;
  onLogout: () => void;
}

export default function StudentHeader({ student, onLogout }: StudentHeaderProps) {
  return (
    <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 no-print">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold font-display text-white">STUDENT PORTAL CHANNEL</h2>
          <p className="text-[10px] text-slate-400 font-mono">Welcome back, {student.name} ({student.id})</p>
        </div>
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
