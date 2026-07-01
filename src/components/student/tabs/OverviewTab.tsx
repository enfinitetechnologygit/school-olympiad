import React from 'react';
import { Volume2, Info, BookOpen, Award } from 'lucide-react';
import { Student, Announcement } from '../../../types';

interface OverviewTabProps {
  student: Student;
  classGroup: string;
  announcements: Announcement[];
  simulatePayment: () => Promise<void>;
}

export default function OverviewTab({
  student,
  classGroup,
  announcements,
  simulatePayment
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      
      {/* Profile welcome summary widgets */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md shadow-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider text-blue-200">
              STUDENT DETAILS RUNDOWN
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display mt-2">{student.name}</h2>
            <p className="text-xs text-blue-100 font-light mt-1">Registered under: <strong>{student.schoolName}</strong> • {student.classLevel}</p>
          </div>

          {student.paymentStatus !== "COMPLETED" ? (
            <div className="p-3 bg-red-500/25 border border-red-500/10 rounded-xl space-y-2 max-w-sm">
              <p className="text-xs text-white">Payment of ₹200 pending. Complete payment to obtain your National Admit Card details.</p>
              <button 
                onClick={simulatePayment}
                className="w-full py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
              >
                Simulate Payment (₹200)
              </button>
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-xs space-y-1">
              <p className="font-semibold text-emerald-300">✓ SECURE REGISTRATION COMPLETED</p>
              <p className="text-slate-300">Receipt Ref: <span className="font-mono text-[10px] text-white">{student.paymentId}</span></p>
              <span className="inline-block mt-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-extrabold uppercase">
                ADMIT CARD LOCKED
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Grid overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        <div className="bg-white border rounded-2xl p-5 relative flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Exam Enrollment ID</span>
            <p className="text-xl font-bold font-display text-slate-900 mt-1 font-mono text-blue-600">{student.id}</p>
          </div>
          <div className="border-t pt-3 mt-4 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Olympiad Record ID</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-bold">2026 Season</span>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 relative flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Highest Mock Score</span>
            <p className="text-xl font-bold font-display text-slate-900 mt-1">
              {student.score !== undefined ? `${student.score}%` : "Not Attempted"}
            </p>
          </div>
          <div className="border-t pt-3 mt-4 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Group Block: Class {classGroup}</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-bold">Info</span>
          </div>
        </div>

      </div>

      {/* Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left col: announcements */}
        <div className="col-span-1 lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-600" />
            Latest Board Announcements
          </h3>
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-500">No active board broadcasts in memory details.</p>
            ) : (
              announcements.map((anc, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                      {anc.postedBy}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(anc.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-display leading-snug">{anc.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{anc.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right col: exam guidelines */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          
          {/* Exam Venue & Practice Guidelines snippet */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Exam & Practice Guidelines
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Mock Exams (Practice)
                </h4>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  Mock exams are strictly online and for practice purposes. They help you get familiar with the test structure and format, and do not impact your official qualification or scoring.
                </p>
              </div>
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <h4 className="font-extrabold text-indigo-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Stage 1 Pre-Exam (Official)
                </h4>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  The official Pre-Exam is a written test held **offline at your enrolled school campus**. Please print your Stage 1 Admit Card and consult your school coordinator for schedule and seating details.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
