import React from 'react';
import { motion } from 'motion/react';
import { 
  Volume2, 
  Info, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  School as SchoolIcon, 
  CreditCard, 
  ArrowRight,
  FileText,
  Sparkles,
  UserCheck
} from 'lucide-react';
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
  // Extract student initial for avatar
  const firstInitial = student.name ? student.name.trim().charAt(0).toUpperCase() : 'S';

  return (
    <div className="space-y-6 font-sans">
      
      {/* Premium Profile Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-950/20 relative overflow-hidden border border-blue-900/30"
      >
        {/* Background ambient lighting glows */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/5 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          
          {/* Left Column: Avatar & Candidate Info */}
          <div className="flex items-start sm:items-center gap-4 md:gap-5">
            {/* Student Initial / Photo Avatar */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl md:text-3xl font-display shadow-lg shadow-blue-500/30 border border-white/20 overflow-hidden">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{firstInitial}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Candidate Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] bg-blue-500/15 border border-blue-400/25 text-blue-300 font-extrabold px-3 py-0.5 rounded-full uppercase tracking-widest">
                  <UserCheck className="w-3 h-3 text-blue-400" />
                  Official Candidate Profile
                </span>
                <span className="text-[10px] font-mono bg-slate-800/80 border border-slate-700/80 text-slate-300 px-2.5 py-0.5 rounded-full font-bold">
                  ID: {student.id}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
                {student.name}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-medium pt-0.5">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <SchoolIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <strong className="font-semibold text-white">{student.schoolName}</strong>
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-[11px] font-bold text-blue-200">
                  {student.classLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Status Card (Payment / Registration Status) */}
          <div className="w-full lg:w-auto shrink-0">
            {student.paymentStatus !== "COMPLETED" ? (
              /* Payment Pending Card */
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 md:p-5 backdrop-blur-md shadow-xl max-w-md w-full space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Registration Pending
                  </span>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Entry fee of <strong className="text-white">₹200.00</strong> pending. Complete payment to issue your official Stage 1 Admit Card.
                </p>
                
                <button 
                  onClick={simulatePayment}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Complete Payment (₹200)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Payment Completed Card */
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 md:p-5 backdrop-blur-md shadow-xl max-w-sm w-full space-y-2.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      Verified Candidate
                    </span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  Receipt Ref: <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{student.paymentId}</span>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Stage 1 Admit Card Ready</span>
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </motion.div>

      {/* Grid overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        <div className="bg-white border border-slate-100 rounded-2xl p-5 relative flex flex-col justify-between shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Enrollment ID</span>
              <p className="text-2xl font-black font-mono text-blue-600 mt-1">{student.id}</p>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-4 text-[11px] text-slate-500 flex justify-between items-center font-medium">
            <span>Olympiad Record Status</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              2026 Active
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 relative flex flex-col justify-between shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Highest Practice Mock Score</span>
              <p className="text-2xl font-extrabold font-display text-slate-900 mt-1">
                {student.score !== undefined ? `${student.score}%` : "Not Attempted"}
              </p>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-4 text-[11px] text-slate-500 flex justify-between items-center font-medium">
            <span>Group Syllabus Block</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
              Class {classGroup}
            </span>
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
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
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
