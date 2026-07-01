import React from 'react';
import { CheckCircle, Cpu } from 'lucide-react';

interface HomeBenefitsProps {
  approvedSchoolsCount: number;
}

export default function HomeBenefits({ approvedSchoolsCount }: HomeBenefitsProps) {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto font-sans no-print">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="col-span-1 lg:col-span-6">
          <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            RECOGNITION & PRIZES
          </span>
          <h2 className="text-3xl font-bold font-display text-slate-950 mt-3 mb-6 leading-tight">
            Benefits of Participating in Enfinite National Olympiad
          </h2>
          <p className="text-slate-500 mb-8 font-light text-base leading-relaxed">
            We look beyond standardized scoring systems, rewarding students for logical persistence, deep analytical curiosity, and computing ingenuity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-950 font-display leading-none">Scholarship Grants</h4>
                <p className="text-xs text-slate-500 mt-1">Cash assistance funds pool for state top scorers.</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-950 font-display leading-none">Official Badges</h4>
                <p className="text-xs text-slate-500 mt-1">ISO aligned digital skill medals & trophies.</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-950 font-display leading-none">National Analytics</h4>
                <p className="text-xs text-slate-500 mt-1">Pinpoint skill gaps relative to global peer metrics.</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-950 font-display leading-none">School Honors</h4>
                <p className="text-xs text-slate-500 mt-1">Prestigious computing institute cups for active coordinators.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats panel */}
        <div className="col-span-1 lg:col-span-6 bg-blue-900 text-white rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-700/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-6 h-6 text-blue-400" />
            <span className="font-semibold text-sm text-blue-300">Live Registration Registry Stats</span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border-l-2 border-blue-500 pl-4">
              <p className="text-5xl font-extrabold font-display">{approvedSchoolsCount}+</p>
              <p className="text-xs text-blue-300 mt-1 font-semibold tracking-wider uppercase">Approved Schools</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-4">
              <p className="text-5xl font-extrabold font-display">12,500+</p>
              <p className="text-xs text-blue-300 mt-1 font-semibold tracking-wider uppercase">Active Students</p>
            </div>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-blue-500/10">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &ldquo;Our school joined last season. It was beautifully timed, high caliber, and our student rohan achieved top state ranks in logical thinking benchmarks.&rdquo;
            </p>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider mt-2.5">
              — Coordinator Dr. Rajesh Sharma, DPS Delhi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
