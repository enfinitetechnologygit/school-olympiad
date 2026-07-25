import React from 'react';
import { Users, Award, Activity, Bell, Calendar, Building } from 'lucide-react';
import { School } from '../../../types';

interface SchoolSidebarProps {
  school: School;
  activeTab: 'roster' | 'qualifiers' | 'analytics' | 'notices' | 'schedule' | 'profile';
  setActiveTab: (tab: 'roster' | 'qualifiers' | 'analytics' | 'notices' | 'schedule' | 'profile') => void;
}

export default function SchoolSidebar({ school, activeTab, setActiveTab }: SchoolSidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-4 shrink-0 justify-between">
      <div className="space-y-1">
        <div className="p-3 mb-4 bg-slate-50 border border-slate-100 rounded-xl font-display">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Principal Officer</span>
          <p className="text-xs font-bold text-slate-900 mt-1">{school.principalName}</p>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Board: {school.boardType} Affiliated</p>
        </div>

        <button
          onClick={() => setActiveTab('roster')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'roster' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          Manage Roster
        </button>

        <button
          onClick={() => setActiveTab('qualifiers')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'qualifiers' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Award className="w-4.5 h-4.5" />
          Qualified Students
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'analytics' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Activity className="w-4.5 h-4.5" />
          Performance Stats
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'notices' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Bell className="w-4.5 h-4.5" />
          Board Circulars
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'schedule' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          Pre-Exam Schedule
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'profile' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 scale-[1.02]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
          }`}
        >
          <Building className="w-4.5 h-4.5" />
          School Profile
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl text-xs text-blue-900 leading-relaxed shadow-inner">
        <h5 className="font-bold flex items-center gap-1 mb-1">
          <Users className="w-4 h-4 text-blue-600" />
          Coordinator:
        </h5>
        <p className="font-semibold text-slate-800">{school.coordinatorName}</p>
        <p className="text-[10px] text-slate-500 mt-1">Direct Helpline: {school.mobile}</p>
      </div>
    </aside>
  );
}
