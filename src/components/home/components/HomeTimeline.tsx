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
            <div>
              <Calendar className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-bold text-slate-900 font-display text-base">May 1 - July 15, 2026</h4>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">Registration Portal Open</p>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">Schools obtain authorization first, followed by students registering online.</p>
          </div>

          <div className="p-5 border border-blue-200 bg-blue-50/50 rounded-xl relative flex flex-col justify-between">
            <span className="absolute top-2 right-2 bg-blue-600 text-[9px] font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded">
              MAIN ASSAY
            </span>
            <div>
              <Calendar className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-bold text-blue-900 font-display text-base">July 30, 2026</h4>
              <p className="text-xs text-blue-600 uppercase font-semibold tracking-wider mt-1">Stage 1 Pre-Exam Date</p>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">Conducted offline/online at respective campus classrooms under teacher supervision.</p>
          </div>

          <div className="p-5 border border-slate-100 bg-slate-50 rounded-xl relative flex flex-col justify-between">
            <div>
              <Calendar className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-bold text-slate-900 font-display text-base">August 10, 2026</h4>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">Result & Admit Roll</p>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">Publishing of list of qualified students eligible for high-stakes Mains examination.</p>
          </div>

          <div className="p-5 border border-indigo-200 bg-indigo-50/40 rounded-xl relative flex flex-col justify-between">
            <div>
              <Calendar className="w-8 h-8 text-indigo-600 mb-3" />
              <h4 className="font-bold text-indigo-900 font-display text-base">August 25, 2026</h4>
              <p className="text-xs text-indigo-600 uppercase font-semibold tracking-wider mt-1">Stage 2 Mains Examination</p>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">Hosted inside certified city centers under live online monitoring systems.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
