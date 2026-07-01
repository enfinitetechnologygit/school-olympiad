import React from 'react';
import { Users, Award, School as SchoolIcon } from 'lucide-react';
import { School } from '../../../types';

interface SchoolStatsBarProps {
  totalStudents: number;
  qualifiedCount: number;
  school: School;
}

export default function SchoolStatsBar({ totalStudents, qualifiedCount, school }: SchoolStatsBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      
      <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Registers</span>
          <p className="text-2xl font-black font-display text-slate-900 mt-1">{totalStudents}</p>
        </div>
        <div className="bg-blue-50 p-3 text-blue-600 rounded-xl">
          <Users className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Stage 2 Qualified</span>
          <p className="text-2xl font-black font-display text-indigo-600 mt-1">{qualifiedCount}</p>
        </div>
        <div className="bg-indigo-50 p-3 text-indigo-600 rounded-xl">
          <Award className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">School Location</span>
          <p className="text-sm font-extrabold font-display text-slate-900 mt-1 leading-tight">{school.city}, {school.state}</p>
        </div>
        <div className="bg-slate-50 p-3 text-slate-500 rounded-xl">
          <SchoolIcon className="w-5 h-5" />
        </div>
      </div>

    </div>
  );
}
