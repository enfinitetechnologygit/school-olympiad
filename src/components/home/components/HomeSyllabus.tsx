import React from 'react';
import { BookOpen, Info } from 'lucide-react';
import { OLYMPIAD_SYLLABUS, EXAM_PATTERN } from '../../../types';

interface HomeSyllabusProps {
  selectedSyllabusGroup: string;
  setSelectedSyllabusGroup: (val: string) => void;
}

export default function HomeSyllabus({
  selectedSyllabusGroup,
  setSelectedSyllabusGroup
}: HomeSyllabusProps) {
  return (
    <section className="bg-slate-900 text-white py-20 px-6 border-t border-slate-800 font-sans" id="syllabus-section">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 font-bold font-mono tracking-widest text-[10px] rounded-full uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            Official Academic Course Guidelines
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            Official Olympiad Curriculum Syllabus
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Select any of the class groups from the menu tab below to explore standard topics in Computer Science, programming block designs, cybersecurity regulations and modern AI paradigms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Box: Menu/Topics Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Group Menu Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(OLYMPIAD_SYLLABUS).map(([id, syllabus]) => {
                const isActive = selectedSyllabusGroup === id;
                const groupNo = id === '5-6' ? '1' : id === '7-8' ? '2' : id === '9-10' ? '3' : '4';
                const classLabelMap: Record<string, string> = {
                  '5-6': 'Class 5th & 6th',
                  '7-8': 'Class 7th & 8th',
                  '9-10': 'Class 9th & 10th',
                  '11-12': 'Class 11th & 12th'
                };
                
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedSyllabusGroup(id)}
                    className={`p-4 rounded-xl text-left transition relative border cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/40'
                        : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-mono text-[9px] font-black uppercase tracking-widest text-blue-400">
                      Group {groupNo}
                    </div>
                    <div className="font-extrabold text-sm font-display mt-1">
                      {classLabelMap[id] || `Class ${id}`}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Syllabus Breakdown Details display */}
            {selectedSyllabusGroup && OLYMPIAD_SYLLABUS[selectedSyllabusGroup] && (
              <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-black font-display text-white">
                    {OLYMPIAD_SYLLABUS[selectedSyllabusGroup].title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {OLYMPIAD_SYLLABUS[selectedSyllabusGroup].description}
                  </p>
                </div>

                {/* Modules grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {OLYMPIAD_SYLLABUS[selectedSyllabusGroup].modules.map((mod, mIdx) => (
                    <div
                      key={mIdx}
                      className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-xl space-y-3 hover:border-blue-500/35 transition"
                    >
                      <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 font-mono flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {mod.name}
                      </h4>
                      <ul className="space-y-1.5">
                        {mod.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-blue-500 font-extrabold">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Syllabus Disclaimer Badge */}
                <div className="bg-blue-500/10 border border-blue-500/25 p-4 rounded-xl text-xs text-slate-300 leading-relaxed flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white">Trial Prep Notice:</span> Dynamic custom test generators inside the student's learning library strictly calibrate themselves to this structured list to boost computational competence.
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Box: Exam Pattern Breakdown Column */}
          <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-lg font-black font-display text-white">National Exam Pattern</h3>
              <p className="text-xs text-slate-400 mt-1">
                Topic weightage map distributed across multi-stage evaluations.
              </p>
            </div>

            {/* Progress-style weightage list */}
            <div className="space-y-4">
              {EXAM_PATTERN.map((pattern, pIdx) => {
                const weightVal = parseInt(pattern.weightage);
                return (
                  <div key={pIdx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-200">{pattern.section}</span>
                      <span className="font-extrabold font-mono text-blue-400">{pattern.weightage}</span>
                    </div>
                    
                    {/* Interactive progress bar */}
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-1.5 block overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${weightVal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick tip box */}
            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl text-[11px] leading-relaxed text-slate-400">
              <span className="font-bold text-slate-200 block mb-1">Testing Information:</span>
              Each Stage 1 test consists of timed interactive multiple choice questions conforming rigidly to these specific segment ratios.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
