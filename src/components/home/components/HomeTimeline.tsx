import React from 'react';
import { Calendar } from 'lucide-react';

export default function HomeTimeline() {
  return (
    <section className="bg-white py-20 px-6 border-y border-slate-100 font-sans no-print" id="agenda-section">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              COMPETITION AGENDA
            </span>
            <h2 className="text-3xl font-bold font-display text-slate-950 mt-3">
              Important Registration & Exam Dates
            </h2>
          </div>
          <p className="text-slate-500 max-w-md mt-4 md:mt-0 text-sm">
            Keep custom track of deadlines. System locks automated admit configurations as soon as scheduling concludes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 border border-slate-100 bg-slate-50 rounded-xl relative flex flex-col justify-between">
            <span className="absolute top-2 right-2 bg-emerald-600 text-[9px] font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded">
              100% FREE
            </span>
            <div>
              <Calendar className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 font-display text-base">May 1 - October 31, 2026</h4>
              <p className="text-xs text-emerald-700 uppercase font-semibold tracking-wider mt-1">Free Registration Open</p>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">Schools and students register online. Registration is completely free for all students.</p>
          </div>

          <div className="p-5 border border-blue-200 bg-blue-50/50 rounded-xl relative flex flex-col justify-between">
            <div>
              <Calendar className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-bold text-blue-900 font-display text-base">Ongoing Prep</h4>
              <p className="text-xs text-blue-600 uppercase font-semibold tracking-wider mt-1">AI Mock Exams & Study Material</p>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">Students access curriculum syllabus and attempt unlimited online mock tests for preparation.</p>
          </div>

          <div className="p-5 border border-amber-300 bg-amber-50/60 rounded-xl relative flex flex-col justify-between">
            <span className="absolute top-2 right-2 bg-amber-500 text-[9px] font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded">
              MAIN EXAM
            </span>
            <div>
              <Calendar className="w-8 h-8 text-amber-600 mb-3" />
              <h4 className="font-bold text-slate-900 font-display text-base">November 2026</h4>
              <p className="text-xs text-amber-700 uppercase font-semibold tracking-wider mt-1">Single Olympiad Exam</p>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">The exact exam date is mutually decided with each participating school campus.</p>
          </div>

          <div className="p-5 border border-indigo-200 bg-indigo-50/40 rounded-xl relative flex flex-col justify-between">
            <div>
              <Calendar className="w-8 h-8 text-indigo-600 mb-3" />
              <h4 className="font-bold text-indigo-900 font-display text-base">December 2026</h4>
              <p className="text-xs text-indigo-600 uppercase font-semibold tracking-wider mt-1">Results & National Merit Awards</p>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">Publishing of national merit rank lists, e-certificates, trophy distribution, and rewards.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
