import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { MockExam } from '../../../types';

interface StudentActiveExamProps {
  activeExam: MockExam;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedAnswers: Record<string, number>;
  handleSelectOption: (questionId: string, optionIndex: number) => void;
  examSecondsLeft: number;
  examSubmitted: any;
  setExamSubmitted: (val: any) => void;
  formatTime: (seconds: number) => string;
  handleSubmitExam: () => void;
  setActiveExam: (exam: MockExam | null) => void;
  fetchDashboardData: () => void;
}

export default function StudentActiveExam({
  activeExam,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  selectedAnswers,
  handleSelectOption,
  examSecondsLeft,
  examSubmitted,
  setExamSubmitted,
  formatTime,
  handleSubmitExam,
  setActiveExam,
  fetchDashboardData
}: StudentActiveExamProps) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-lg p-6 space-y-6">
      
      {/* Exam Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-lg font-bold font-display text-slate-950">{activeExam.title}</h3>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            Class Group Block: {activeExam.classGroup} • Computer Science Logic
          </p>
        </div>

        <div className="flex items-center gap-3 bg-red-50 text-red-800 border border-red-100 px-4 py-2 rounded-xl">
          <Clock className="w-5 h-5 text-red-600 animate-pulse" />
          <div>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider leading-none">Time Remaining</p>
            <p className="text-lg font-mono font-black mt-1">{formatTime(examSecondsLeft)}</p>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-slate-50 p-2.5 rounded-xl border flex items-center justify-between text-xs text-slate-600">
        <span>Attempting question <strong>{currentQuestionIndex + 1}</strong> of <strong>{activeExam.totalQuestions}</strong></span>
        <span className="text-blue-600 font-bold">Grading mode: Automatic scoring</span>
      </div>

      {!examSubmitted ? (
        <>
          {/* Current Question panel */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-bold font-display text-slate-900 leading-snug">
              Q{currentQuestionIndex + 1}. {activeExam.questions[currentQuestionIndex]?.question}
            </h4>

            {/* MCQs */}
            <div className="space-y-2.5">
              {activeExam.questions[currentQuestionIndex]?.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[activeExam.questions[currentQuestionIndex].id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(activeExam.questions[currentQuestionIndex].id, oIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition active:scale-99 cursor-pointer flex items-center gap-3 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border-slate-300'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav button row */}
          <div className="flex mt-6 justify-between items-center pt-4 border-t">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
            >
              Previous Question
            </button>

            <div className="flex gap-2">
              {currentQuestionIndex < activeExam.totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-extrabold shadow cursor-pointer"
                >
                  Submit Practice Answers
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Results card overlay */
        <div className="p-6 bg-blue-50/50 border border-blue-200 rounded-xl space-y-6 text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold font-display text-blue-950">Mock Test Submitted Successfully!</h3>
            <p className="text-xs text-slate-500 mt-1">Real-time grading completed synchronously across regional standards.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-3 bg-white rounded-lg border border-slate-100 font-display">
              <p className="text-[10px] text-slate-400 font-bold uppercase">SCORE ACHIEVED</p>
              <p className="text-3xl font-extrabold text-blue-600 mt-1">{examSubmitted.score}%</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-100 font-display">
              <p className="text-[10px] text-slate-400 font-bold uppercase">CORRECT</p>
              <p className="text-3xl font-extrabold text-slate-700 mt-1">{examSubmitted.correctCount} / {examSubmitted.totalCount}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setActiveExam(null); setExamSubmitted(null); fetchDashboardData(); }}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs cursor-pointer"
          >
            Return to Student Dashboard
          </button>
        </div>
      )}

    </div>
  );
}
