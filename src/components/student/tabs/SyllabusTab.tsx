import React from 'react';
import { BookOpen, Info } from 'lucide-react';
import { OLYMPIAD_SYLLABUS } from '../../../types';

interface SyllabusTabProps {
  classGroup: string;
  selectedSyllabusId: string;
  setSelectedSyllabusId: (id: string) => void;
}

export default function SyllabusTab({
  classGroup,
  selectedSyllabusId,
  setSelectedSyllabusId
}: SyllabusTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold font-display text-slate-950">Official Curriculum Guidelines</h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose a group from the curriculum menu below to review detailed IT, programming, relational databases, and logical reasoning sub-topics.
          </p>
        </div>

        {/* Group Selector Menu */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(OLYMPIAD_SYLLABUS).map(([id, syllabus]) => {
            const isSelect = selectedSyllabusId === id;
            const isOwnGroup = classGroup === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedSyllabusId(id)}
                className={`p-3 rounded-xl border text-left transition relative cursor-pointer ${
                  isSelect
                    ? 'bg-blue-600 border-blue-600 text-white shadow'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-extrabold text-[10px] uppercase tracking-wider font-mono">
                  Group {id === '5-6' ? 'A' : id === '7-8' ? 'B' : id === '9-10' ? 'C' : 'D'}
                </div>
                <div className={`text-xs font-bold mt-1 ${isSelect ? 'text-blue-100' : 'text-slate-955'}`}>
                  Class {id} Preset
                </div>
                {isOwnGroup && (
                  <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                    isSelect ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-805'
                  }`}>
                    Your Group
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Syllabus Breakdown Details Card */}
      {selectedSyllabusId && OLYMPIAD_SYLLABUS[selectedSyllabusId] && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-900 rounded-full text-[10px] font-bold font-mono">
              <BookOpen className="w-3.5 h-3.5 text-blue-700" />
              OFFICIAL CURRICULUM PRESET
            </div>
            <h4 className="text-base font-black text-slate-900 mt-2 font-display">
              {OLYMPIAD_SYLLABUS[selectedSyllabusId].title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {OLYMPIAD_SYLLABUS[selectedSyllabusId].description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OLYMPIAD_SYLLABUS[selectedSyllabusId].modules.map((mod, mIdx) => (
              <div key={mIdx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-600 block">
                  Curriculum Module {mIdx + 1}
                </span>
                <h5 className="font-extrabold text-sm text-slate-900 border-b pb-2">
                  {mod.name}
                </h5>
                <ul className="space-y-2">
                  {mod.topics.map((topic, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                      <span className="font-medium">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 text-blue-900 p-4 rounded-xl border border-blue-100 text-xs leading-relaxed flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold">Olympiad Trial Notes:</span> All trial mock exams generated dynamically from the portal comply strictly with this curriculum. Keep reviewing to maximize your potential scoring results.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
