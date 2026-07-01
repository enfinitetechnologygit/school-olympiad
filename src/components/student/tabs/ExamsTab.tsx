import React from 'react';
import { HelpCircle, BookOpen, ArrowRight } from 'lucide-react';
import { MockExam, StudentExamAttempt } from '../../../types';

interface ExamsTabProps {
  classGroup: string;
  matchedExams: MockExam[];
  attempts: StudentExamAttempt[];
  handleStartExam: (exam: MockExam) => void;
}

export default function ExamsTab({
  classGroup,
  matchedExams,
  attempts,
  handleStartExam
}: ExamsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-slate-950">Practice Mock Exams (Online Practice Only)</h3>
        <p className="text-xs text-slate-500 mt-1">
          These online mock exams are strictly for self-practice and logic training corresponding to class Group <strong>{classGroup}</strong>.
          They do **not** carry official scoring weight or affect your qualification status.
          The official **Stage 1 Pre-Exam** will be conducted offline at your school campus.
        </p>
      </div>

      {matchedExams.length === 0 ? (
        <div className="p-8 bg-white text-center rounded-xl border border-dashed space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">No Mock Exams scheduled currently for your group tier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchedExams.map((exam, idx) => (
            <div key={idx} className="bg-white border rounded-2xl p-5 flex flex-col justify-between shadow-sm relative">
              <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                {exam.durationMinutes} Minutes
              </span>

              <div>
                <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-slate-950 font-display text-base leading-tight">{exam.title}</h4>
                <p className="text-xs text-slate-500 mt-1">This practice test contains <strong>{exam.totalQuestions} multiple-choice questions</strong> based on standardized testing benchmarks.</p>
              </div>

              {(() => {
                const examAttempts = attempts.filter(att => att.examId === exam.id);
                if (examAttempts.length > 0) {
                  const highestScoreAttempt = [...examAttempts].sort((a, b) => b.score - a.score)[0];
                  const latestAttempt = [...examAttempts].sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())[0];
                  return (
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Practice Attempts</span>
                        <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded font-black font-mono">
                          {examAttempts.length} Total
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-700 mt-1">
                        <div className="p-2 bg-white rounded border border-slate-150">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Highest Score</p>
                          <p className="text-sm font-extrabold text-blue-600 mt-0.5">{highestScoreAttempt.score}%</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-slate-150">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Latest Score</p>
                          <p className="text-sm font-extrabold text-slate-700 mt-0.5">{latestAttempt.score}%</p>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono">
                        Last attempted: {new Date(latestAttempt.attemptedAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Practice Mode (Unlimited Attempts)</span>
                <button
                  onClick={() => handleStartExam(exam)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition active:scale-98"
                >
                  Launch Practice Test
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
