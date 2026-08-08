import React from 'react';
import { Users, Award, School as SchoolIcon, CreditCard } from 'lucide-react';
import { School } from '../../../types';

interface SchoolStatsBarProps {
  totalStudents: number;
  qualifiedCount: number;
  paidCount: number;
  school: School;
}

export default function SchoolStatsBar({ totalStudents, qualifiedCount, paidCount, school }: SchoolStatsBarProps) {
  const pendingCount = totalStudents - paidCount;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
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

      {/* Payment status stat */}
      <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Fee Payment</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="text-2xl font-black font-display text-emerald-600">{paidCount}</p>
            <span className="text-xs text-slate-400 font-semibold">paid</span>
            {pendingCount > 0 && (
              <span className="text-xs font-bold text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>
        <div className="bg-emerald-50 p-3 text-emerald-600 rounded-xl">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

    </div>
  );
}
