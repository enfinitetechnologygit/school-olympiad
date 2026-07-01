import React from 'react';
import { Cpu, Users, Layers } from 'lucide-react';

export default function HomeHighlights() {
  return (
    <section className="bg-white border-b border-slate-100 py-10 px-6 no-print">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex gap-4 items-start">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Computer Science Only</h3>
            <p className="text-sm text-slate-500 mt-1">This national challenge is exclusively dedicated to computing, logic, and informatics mechanics.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Classes 5th to 12th</h3>
            <p className="text-sm text-slate-500 mt-1">Categorized into class blocks: 5-6, 7-8, 9-10, and 11-12. Tasks tailored to standard curriculum levels.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">National Staged Assessment</h3>
            <p className="text-sm text-slate-500 mt-1">Participate alongside thousands of students nationwide to achieve top state credentials.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
