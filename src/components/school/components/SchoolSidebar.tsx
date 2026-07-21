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
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'roster' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          Manage Roster
        </button>

        <button
          onClick={() => setActiveTab('qualifiers')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'qualifiers' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4.5 h-4.5" />
          Qualified Students
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'analytics' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4.5 h-4.5" />
          Performance Stats
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'notices' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4.5 h-4.5" />
          Board Circulars
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'schedule' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          Pre-Exam Schedule
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'profile' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4.5 h-4.5" />
          School Profile
        </button>
      </div>

      <div className="bg-blue-50/75 border border-blue-100 p-3.5 rounded-xl text-xs text-blue-900 leading-relaxed">
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
