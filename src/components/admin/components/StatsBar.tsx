import React from 'react';
import { Building, Users, CreditCard, Award } from 'lucide-react';

interface StatsBarProps {
  stats: {
    approvedSchools: number;
    totalStudents: number;
    totalEarnings: number;
    qualifiedStudents: number;
  } | null;
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
      <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Approved Campuses</span>
          <p className="text-2xl font-black font-display text-slate-950 mt-1">{stats ? stats.approvedSchools : 0}</p>
        </div>
        <div className="bg-blue-50 p-3 text-blue-600 rounded-xl">
          <Building className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Registered Candidates</span>
          <p className="text-2xl font-black font-display text-slate-950 mt-1">{stats ? stats.totalStudents : 0}</p>
        </div>
        <div className="bg-purple-50 p-3 text-purple-600 rounded-xl">
          <Users className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Olympiad Earnings Pool</span>
          <p className="text-2xl font-black font-display text-emerald-600 mt-1">₹{stats ? stats.totalEarnings : 0}</p>
        </div>
        <div className="bg-emerald-50 p-3 text-emerald-600 rounded-xl">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider text-indigo-800">Stage 2 Mains Qualifiers</span>
          <p className="text-xl font-black font-display text-indigo-700 mt-1">{stats ? stats.qualifiedStudents : 0} Candidates</p>
        </div>
        <div className="bg-indigo-50 p-3 text-indigo-600 rounded-xl">
          <Award className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
