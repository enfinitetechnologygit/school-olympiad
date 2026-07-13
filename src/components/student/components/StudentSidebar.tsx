import React from 'react';
import { Award, Clock, FileText, BookOpen, Sparkles } from 'lucide-react';
import { Student } from '../../../types';

interface StudentSidebarProps {
  student: Student;
  activeTab: 'overview' | 'exams' | 'history' | 'admitCard' | 'syllabus';
  setActiveTab: (tab: 'overview' | 'exams' | 'history' | 'admitCard' | 'syllabus') => void;
  setActiveExam: (exam: any) => void;
}

export default function StudentSidebar({ student, activeTab, setActiveTab, setActiveExam }: StudentSidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-4 shrink-0 justify-between no-print">
      <div className="space-y-1">
        <div className="p-3 mb-4 bg-blue-50 text-blue-900 rounded-xl">
          <span className="text-[9px] uppercase font-bold tracking-widest text-blue-600">National Council</span>
          <p className="text-xs font-bold font-display mt-0.5 leading-tight">{student.schoolName}</p>
          <p className="text-[9px] text-slate-500 font-mono mt-1 font-semibold uppercase">{student.classLevel} division</p>
        </div>

        <button
          onClick={() => { setActiveTab('overview'); setActiveExam(null); }}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4.5 h-4.5" />
          Portal Overview
        </button>

        <button
          onClick={() => { setActiveTab('exams'); setActiveExam(null); }}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'exams' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4.5 h-4.5" />
          Practice Mock Exams
        </button>

        <button
          onClick={() => { setActiveTab('admitCard'); setActiveExam(null); }}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'admitCard' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4.5 h-4.5" />
          Print Admit Card
        </button>

        <button
          onClick={() => { setActiveTab('syllabus'); setActiveExam(null); }}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'syllabus' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          Olympiad Syllabus
        </button>


      </div>

      <div className="border-t border-slate-100 pt-4 space-y-2">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Pre-Exam Registration</span>
          <p className="text-xs font-extrabold text-slate-700 mt-1 leading-none uppercase">{student.paymentStatus}</p>
        </div>
      </div>
    </aside>
  );
}
