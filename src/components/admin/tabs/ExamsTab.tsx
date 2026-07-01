import React from 'react';
import { Sparkles, Brain, ShieldAlert, CheckCircle, Plus, X, BookOpen } from 'lucide-react';
import { MockExam, OLYMPIAD_SYLLABUS } from '../../../types';

interface ExamsTabProps {
  exams: MockExam[];
  aiGroup: string;
  setAiGroup: (val: string) => void;
  aiDifficulty: string;
  setAiDifficulty: (val: string) => void;
  aiCount: number;
  setAiCount: (val: number) => void;
  aiDuration: number;
  setAiDuration: (val: number) => void;
  aiTopic: string;
  setAiTopic: (val: string) => void;
  aiGenerating: boolean;
  aiStatusMessage: string;
  aiError: string;
  aiPreviewExam: MockExam | null;
  handleAIGenerateExam: (e: React.FormEvent) => void;
  handleEditPreviewTitle: (val: string) => void;
  handleEditPreviewClassGroup: (val: string) => void;
  handleEditPreviewDuration: (val: number) => void;
  handleAddPreviewQuestionSlot: () => void;
  handleDeletePreviewQuestion: (idx: number) => void;
  handleEditPreviewQuestionText: (idx: number, text: string) => void;
  handleEditPreviewQuestionOption: (qIdx: number, oIdx: number, val: string) => void;
  handleEditPreviewQuestionCorrectOption: (qIdx: number, correctIdx: number) => void;
  handlePublishAIExam: () => void;
  selectedAdminSyllabusId: string;
  setSelectedAdminSyllabusId: (val: string) => void;
}

export default function ExamsTab({
  exams,
  aiGroup,
  setAiGroup,
  aiDifficulty,
  setAiDifficulty,
  aiCount,
  setAiCount,
  aiDuration,
  setAiDuration,
  aiTopic,
  setAiTopic,
  aiGenerating,
  aiStatusMessage,
  aiError,
  aiPreviewExam,
  handleAIGenerateExam,
  handleEditPreviewTitle,
  handleEditPreviewClassGroup,
  handleEditPreviewDuration,
  handleAddPreviewQuestionSlot,
  handleDeletePreviewQuestion,
  handleEditPreviewQuestionText,
  handleEditPreviewQuestionOption,
  handleEditPreviewQuestionCorrectOption,
  handlePublishAIExam,
  selectedAdminSyllabusId,
  setSelectedAdminSyllabusId
}: ExamsTabProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Left Column: Generator Form & Active Draft Previews */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Premium AI Generator Control Card */}
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-6" id="ai-generator-panel">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold font-mono tracking-widest text-[9px] rounded-full uppercase animate-pulse" id="badge-ai-model">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Gemini Server-Side Intelligence
              </div>
              <h3 className="text-lg font-black font-display text-white mt-2" id="title-ai-heading">AI-Powered Instant Olympiad Test Generator</h3>
              <p className="text-xs text-slate-300 mt-1">
                Generate a fully functional, curriculum-aligned Computer Science Olympiad trial mock exam in a single click. Select a class group or pick a custom sub-topic from the syllabus guide sidebar.
              </p>
            </div>
            <div className="bg-slate-800 p-3 rounded-2xl text-white shrink-0 border border-slate-700 hidden sm:block">
              <Brain className="w-7 h-7 text-blue-400" />
            </div>
          </div>

          <form onSubmit={handleAIGenerateExam} className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-5 text-slate-200" id="form-ai-inputs">
            <div className="md:col-span-3">
              <label className="font-bold text-slate-300 block mb-1.5 text-xs">Class Cohort Group</label>
              <select
                id="select-ai-cohort"
                value={aiGroup} onChange={(e) => setAiGroup(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-lg font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              >
                <option value="5-6">Group A (Class 5th - 6th)</option>
                <option value="7-8">Group B (Class 7th - 8th)</option>
                <option value="9-10">Group C (Class 9th - 10th)</option>
                <option value="11-12">Group D (Class 11th - 12th)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="font-bold text-slate-300 block mb-1.5 text-xs">Cognitive Difficulty Level</label>
              <select
                id="select-ai-difficulty"
                value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 p-2.5 rounded-lg font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              >
                <option value="EASY">EASY (Foundational Concepts)</option>
                <option value="MODERATE">MODERATE (Logic & Analytics)</option>
                <option value="HARD">HARD (Olympiad-Grade Complex Coding)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="font-bold text-slate-300 block mb-1.5 text-xs">Total Questions Count</label>
              <select
                id="select-ai-count"
                value={aiCount} onChange={(e) => setAiCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700/80 p-2.5 rounded-lg font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              >
                <option value="3">3 MCQ Questions</option>
                <option value="5">5 MCQ Questions</option>
                <option value="10">10 MCQ Questions</option>
                <option value="15">15 MCQ Questions</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="font-bold text-slate-300 block mb-1.5 text-xs">Duration (Minutes)</label>
              <input
                id="input-ai-duration"
                type="number" required min="10" max="120"
                value={aiDuration} onChange={(e) => setAiDuration(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700/80 p-2.5 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              />
            </div>

            <div className="md:col-span-12">
              <label className="font-bold text-slate-300 block mb-1.5 flex justify-between text-xs">
                <span>Custom Topic Focus (Optional Syllabus Sub-topic keywords)</span>
                <span className="text-slate-500 font-mono text-[10px]">e.g. Recursion, Logic Gates, HTML Tags</span>
              </label>
              <input
                id="input-ai-topic"
                type="text"
                placeholder="Leave empty or click any sub-topic in the right sidebar menu to auto-configure..."
                value={aiTopic} onChange={(e) => setAiTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              />
            </div>

            <div className="md:col-span-12 pt-2">
              <button
                id="btn-ai-generate"
                type="submit"
                disabled={aiGenerating}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border border-indigo-500 text-white font-extrabold text-sm rounded-xl tracking-wide shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {aiGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{aiStatusMessage}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    <span>Generate Interactive Draft Test</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error status reporting */}
          {aiError && (
            <div className="p-4 bg-red-950/70 border border-red-500/30 text-red-200 rounded-xl flex items-start gap-2.5 text-xs" id="status-ai-error">
              <ShieldAlert className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">AI Generation Exception:</span>
                <p className="mt-1 text-slate-300 leading-relaxed font-mono">{aiError}</p>
              </div>
            </div>
          )}

          {/* Generated AI Exam edit & preview drawer */}
          {aiPreviewExam && (
            <div className="p-6 bg-slate-950 border border-indigo-500/40 rounded-2xl space-y-6 text-slate-200" id="ai-exam-preview-drawer">
              <div className="pb-4 border-b border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/30">
                    <CheckCircle className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">AI-Draft Composed successfully! Review & Custom-Edit before publishing:</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Reference ID: <strong className="font-mono text-slate-300">{aiPreviewExam.id}</strong> • Highlight and correct any technical question formulations, choices, or answers below.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2 text-slate-700">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Interactive Exam Title</label>
                    <input
                      type="text"
                      value={aiPreviewExam.title}
                      onChange={(e) => handleEditPreviewTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Target Class Cohort / Group</label>
                    <select
                      value={aiPreviewExam.classGroup}
                      onChange={(e) => handleEditPreviewClassGroup(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="5-6">Group A (Class 5th - 6th)</option>
                      <option value="7-8">Group B (Class 7th - 8th)</option>
                      <option value="9-10">Group C (Class 9th - 10th)</option>
                      <option value="11-12">Group D (Class 11th - 12th)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Duration Period (Minutes)</label>
                    <input
                      type="number"
                      value={aiPreviewExam.durationMinutes}
                      onChange={(e) => handleEditPreviewDuration(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">Draft Questions Breakdown ({aiPreviewExam.questions.length})</span>
                  <button
                    type="button"
                    onClick={handleAddPreviewQuestionSlot}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-mono inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Question Slot
                  </button>
                </div>

                {aiPreviewExam.questions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 relative text-xs text-slate-200">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                      <span className="font-extrabold text-blue-300 font-mono">Question Item #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeletePreviewQuestion(idx)}
                        className="px-2 py-1 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-900/30 rounded text-[10px] font-bold font-mono transition inline-flex items-center gap-1 cursor-pointer"
                        title="Discard this question block"
                      >
                        <X className="w-3 h-3" />
                        Discard Question
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Question Statement Body</label>
                      <textarea
                        rows={2}
                        value={q.question}
                        onChange={(e) => handleEditPreviewQuestionText(idx, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="space-y-1">
                          <label className="block text-[10px] text-slate-400 font-mono font-bold">
                            <span>Option {String.fromCharCode(65 + oIdx)} {oIdx === q.correctOption ? '• CORRECT CHOICE' : ''}</span>
                          </label>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleEditPreviewQuestionOption(idx, oIdx, e.target.value)}
                            className={`w-full bg-slate-950 border p-2.5 rounded-lg text-white text-xs focus:outline-none ${oIdx === q.correctOption ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' : 'border-slate-700 text-white'}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="w-64 pt-1 text-slate-700">
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Specify Correct Answer Option Index</label>
                      <select
                        value={q.correctOption}
                        onChange={(e) => handleEditPreviewQuestionCorrectOption(idx, Number(e.target.value))}
                        className="w-full bg-slate-955 bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-white font-bold font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-xs"
                      >
                        <option value="0">Option A</option>
                        <option value="1">Option B</option>
                        <option value="2">Option C</option>
                        <option value="3">Option D</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-[11px] text-slate-400 leading-normal max-w-md">
                  Please review all fields, question statements, and correctness mappings above. Clicking publish instantly signs and deploys this olympiad exam to the active Student Portals.
                </div>
                <button
                  type="button"
                  onClick={handlePublishAIExam}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border border-emerald-500 text-white font-black text-sm rounded-xl tracking-wide shadow-md flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Publish & Show in Student Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Composition of active exams */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-3">
          <h4 className="font-bold font-display text-slate-950 text-sm">Active Mock Exams In System Base ({exams.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exams.map((ex, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border rounded-xl space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-blue-600 uppercase tracking-wide">GROUP {ex.classGroup}</span>
                  <span className="text-slate-400 font-mono">{ex.durationMinutes} Minutes</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-display leading-tight">{ex.title}</h4>
                <p className="text-[10px] text-slate-500 font-mono">Contains: {ex.totalQuestions} questions • Exam Ref: {ex.id}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Syllabus Curriculum Guide Menu */}
      <div className="xl:col-span-4 bg-white p-5 border border-slate-200 rounded-2xl space-y-5 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold font-mono text-[9px] uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            Syllabus Guide
          </div>
          <h4 className="text-xs font-bold font-display text-slate-900 mt-1.5">Interactive Curriculum Map</h4>
          <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
            Click any sub-topic in this official syllabus menu to automatically preconfigure the class cohort group and fill the Custom Topic Focus parameter.
          </p>
        </div>

        <div>
          <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-mono">Select Group Curriculum</label>
          <select
            value={selectedAdminSyllabusId}
            onChange={(e) => setSelectedAdminSyllabusId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="5-6">Group A (Class 5th - 6th)</option>
            <option value="7-8">Group B (Class 7th - 8th)</option>
            <option value="9-10">Group C (Class 9th - 10th)</option>
            <option value="11-12">Group D (Class 11th - 12th)</option>
          </select>
        </div>

        {selectedAdminSyllabusId && OLYMPIAD_SYLLABUS[selectedAdminSyllabusId] && (
          <div className="space-y-4 pt-1 max-h-[620px] overflow-y-auto pr-1">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[10px] text-blue-900 leading-normal">
              <strong className="text-blue-900 block font-bold mb-0.5">{OLYMPIAD_SYLLABUS[selectedAdminSyllabusId].title}</strong>
              {OLYMPIAD_SYLLABUS[selectedAdminSyllabusId].description}
            </div>

            <div className="space-y-3">
              {OLYMPIAD_SYLLABUS[selectedAdminSyllabusId].modules.map((mod, mIdx) => (
                <div key={mIdx} className="border border-slate-100 p-3 rounded-xl space-y-2 bg-slate-50/40">
                  <h5 className="font-extrabold text-[10px] uppercase tracking-wide text-slate-400 font-mono border-b pb-1.5">{mod.name}</h5>
                  <div className="space-y-1">
                    {mod.topics.map((topic, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => {
                          setAiTopic(topic);
                          setAiGroup(selectedAdminSyllabusId);
                        }}
                        className="w-full text-left p-1.5 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded text-[10px] text-slate-700 font-medium transition flex items-start gap-1 p-1 hover:text-blue-700 cursor-pointer"
                        title="Click to load this syllabus topic focus"
                      >
                        <span className="text-blue-500 font-bold shrink-0 select-none">+</span>
                        <span className="leading-tight text-left">{topic}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
