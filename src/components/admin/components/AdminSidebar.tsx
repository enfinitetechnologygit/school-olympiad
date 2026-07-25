import React from 'react';
import { Building, Users, Clock, Rss, MapPin, Calendar, Layers, KeyRound } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'approvals' | 'students' | 'exams' | 'broadcasting' | 'centers' | 'database' | 'schedule' | 'security';
  setActiveTab: (tab: 'approvals' | 'students' | 'exams' | 'broadcasting' | 'centers' | 'database' | 'schedule' | 'security') => void;
  setSelectedSchoolProfile: (school: any) => void;
  pendingRequestsCount: number;
  earnings: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  setSelectedSchoolProfile,
  pendingRequestsCount,
  earnings
}: AdminSidebarProps) {
  const handleTabClick = (tab: 'approvals' | 'students' | 'exams' | 'broadcasting' | 'centers' | 'database' | 'schedule' | 'security') => {
    setActiveTab(tab);
    setSelectedSchoolProfile(null);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-4 shrink-0 justify-between">
      <div className="space-y-1">
        <div className="p-3 mb-4 bg-slate-900 text-blue-300 rounded-xl">
          <span className="text-[9px] uppercase tracking-widest font-bold">SYSTEM METRICS</span>
          <h5 className="text-sm font-bold text-white font-display mt-0.5">Control Terminal</h5>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px]">
            <span>Earning Pool:</span>
            <span className="text-emerald-400 font-bold font-mono">₹{earnings}</span>
          </div>
        </div>

        <button
          onClick={() => handleTabClick('approvals')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'approvals' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Building className="w-4.5 h-4.5" />
          School Requests ({pendingRequestsCount})
        </button>

        <button
          onClick={() => handleTabClick('students')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'students' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          Manage Students
        </button>

        <button
          onClick={() => handleTabClick('exams')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'exams' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Clock className="w-4.5 h-4.5" />
          Mock Exam Composer
        </button>

        <button
          onClick={() => handleTabClick('broadcasting')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'broadcasting' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Rss className="w-4.5 h-4.5" />
          Notice Broadcaster
        </button>

        <button
          onClick={() => handleTabClick('centers')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'centers' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <MapPin className="w-4.5 h-4.5" />
          Exam Centers Desk
        </button>

        <button
          onClick={() => handleTabClick('schedule')}
          id="btn-schedule-desk"
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'schedule' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          Exam Schedule Desk
        </button>

        <button
          onClick={() => handleTabClick('database')}
          id="btn-database-desk"
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'database' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Layers className="w-4.5 h-4.5" />
          Database Desk
        </button>

        <button
          onClick={() => handleTabClick('security')}
          id="btn-security-desk"
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'security' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <KeyRound className="w-4.5 h-4.5" />
          Security & Password
        </button>
      </div>

      <div className="bg-slate-950 text-white p-4 rounded-2xl text-center border border-slate-850 shadow-inner">
        <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase">SECURE SESSION</span>
        <p className="text-[10px] text-emerald-400 font-bold block mt-1.5">● VERIFIED ONLINE</p>
      </div>
    </aside>
  );
}
