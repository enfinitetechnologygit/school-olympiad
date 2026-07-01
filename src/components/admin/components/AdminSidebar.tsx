import React from 'react';
import { Building, Users, Clock, Rss, MapPin, Calendar, Layers } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'approvals' | 'students' | 'exams' | 'broadcasting' | 'centers' | 'database' | 'schedule';
  setActiveTab: (tab: 'approvals' | 'students' | 'exams' | 'broadcasting' | 'centers' | 'database' | 'schedule') => void;
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
  const handleTabClick = (tab: 'approvals' | 'students' | 'exams' | 'broadcasting' | 'centers' | 'database' | 'schedule') => {
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
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'approvals' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4.5 h-4.5" />
          School Requests ({pendingRequestsCount})
        </button>

        <button
          onClick={() => handleTabClick('students')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'students' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          Manage Students
        </button>

        <button
          onClick={() => handleTabClick('exams')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'exams' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4.5 h-4.5" />
          Mock Exam Composer
        </button>

        <button
          onClick={() => handleTabClick('broadcasting')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'broadcasting' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Rss className="w-4.5 h-4.5" />
          Notice Broadcaster
        </button>

        <button
          onClick={() => handleTabClick('centers')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'centers' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4.5 h-4.5" />
          Exam Centers Desk
        </button>

        <button
          onClick={() => handleTabClick('schedule')}
          id="btn-schedule-desk"
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'schedule' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          Exam Schedule Desk
        </button>

        <button
          onClick={() => handleTabClick('database')}
          id="btn-database-desk"
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'database' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4.5 h-4.5" />
          Database Desk
        </button>
      </div>

      <div className="bg-slate-950 text-white p-3.5 rounded-xl text-center border border-slate-800">
        <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase">SECURE SESSION</span>
        <p className="text-[10px] text-emerald-400 font-bold block mt-1">● VERIFIED ONLINE</p>
      </div>
    </aside>
  );
}
