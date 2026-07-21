import React from 'react';
import { Search } from 'lucide-react';
import { Student, ExamCenter } from '../../../types';
import Combobox from '../../ui/Combobox';

interface StudentsTabProps {
  students: Student[];
  studentSearch: string;
  setStudentSearch: (val: string) => void;
  isBulkUploadOpen: boolean;
  setIsBulkUploadOpen: (val: boolean) => void;
  bulkStatusMessage: string;
  setBulkStatusMessage: (val: string) => void;
  bulkInputText: string;
  setBulkInputText: (val: string) => void;
  handleBulkUploadResultsSubmit: (text: string) => void;
  handleApproveCandidatePayment: (studentId: string) => void;
  handleUpdateScore: (studentId: string, score: number) => void;
  handleStage1Release: (studentId: string, release: boolean) => void;
  handleStage2Release: (studentId: string, release: boolean) => void;
  handleManualQualify: (studentId: string, status: 'QUALIFIED' | 'NOT_QUALIFIED' | 'TBD') => void;
  handleAllocateCenter: (studentId: string, examCenterId: string) => void;
  centers: ExamCenter[];
}

export default function StudentsTab({
  students,
  studentSearch,
  setStudentSearch,
  isBulkUploadOpen,
  setIsBulkUploadOpen,
  bulkStatusMessage,
  setBulkStatusMessage,
  bulkInputText,
  setBulkInputText,
  handleBulkUploadResultsSubmit,
  handleApproveCandidatePayment,
  handleUpdateScore,
  handleStage1Release,
  handleStage2Release,
  handleManualQualify,
  handleAllocateCenter,
  centers
}: StudentsTabProps) {
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.classLevel.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold font-display text-slate-950">Master Candidates Database</h3>
            <p className="text-xs text-slate-500 mt-0.5">Override qualifier flags or allocate admit card serial credentials directly.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setIsBulkUploadOpen(!isBulkUploadOpen);
                setBulkStatusMessage("");
              }}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer select-none border whitespace-nowrap ${
                isBulkUploadOpen 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
              }`}
            >
              📊 Bulk Upload Results
            </button>

            <div className="relative text-xs w-full sm:w-48 md:w-64">
              <Search className="absolute left-2.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate name or class..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-slate-50 border p-2 pl-9 rounded-lg"
              />
            </div>
          </div>
        </div>

        {isBulkUploadOpen && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <span>📂 CSV/Excel Bulk Results Injector Tool</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsBulkUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-extrabold text-[10px] uppercase cursor-pointer"
              >
                ✕ Close Tool
              </button>
            </div>

            <p className="text-slate-500 leading-relaxed text-[11px]">
              Paste your CSV result logs below. Each row must contain a candidate identification key (Unique Student ID like <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1 rounded">ENO-ST-XXXXX</span> or registered Email) followed by their score value separated by a comma (e.g. <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1 rounded">ENO-ST-83120, 95</span>). Score values must range from <span className="font-semibold text-slate-700">0 to 100</span>. Any matched candidates' qualifiers will update accordingly.
            </p>

            {bulkStatusMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg font-bold flex items-center gap-1.5 text-[11px]">
                <span>✅</span>
                <span>{bulkStatusMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Raw input logs */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">CSV/Logs Raw Paste Panel</label>
                <textarea
                  rows={6}
                  placeholder={`ENO-ST-83120, 92\nENO-ST-12495, 88\ncandidate@email.com, 74`}
                  value={bulkInputText}
                  onChange={(e) => setBulkInputText(e.target.value)}
                  className="w-full font-mono bg-white border border-slate-200 rounded-lg p-2.5 text-[11px] leading-relaxed outline-none focus:border-blue-500 shadow-inner h-[135px]"
                />
              </div>

              {/* Right: Real-time Pre-validation mapping */}
              <div className="space-y-1.5 flex flex-col">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Real-time Verified Mapping State</label>
                <div className="bg-white border rounded-lg p-3 flex-1 overflow-y-auto h-[135px] max-h-[135px] space-y-1 font-mono text-[10px] text-slate-600">
                  {(() => {
                    if (!bulkInputText.trim()) return <p className="text-slate-400 italic text-[11px] mt-10 text-center">Awaiting CSV pasting feed for parsing validation...</p>;
                    const parsedLines = bulkInputText.split('\n').filter(l => l.trim() !== '');
                    return parsedLines.map((line, idx) => {
                      const [rawId, rawScore] = line.split(',');
                      if (!rawId || !rawScore) {
                        return <div key={idx} className="text-red-500 mb-0.5 font-bold">⚠️ Line {idx+1}: Formatting error (Missing comma separator)</div>;
                      }
                      const valId = rawId.trim();
                      const valSc = parseInt(rawScore.trim());
                      if (isNaN(valSc) || valSc < 0 || valSc > 100) {
                        return <div key={idx} className="text-red-500 mb-0.5 font-bold">⚠️ Line {idx+1}: Invalid score value "{rawScore.trim()}" (Must be 0-100)</div>;
                      }
                      // Match student
                      const matched = students.find(s => s.id === valId || s.email?.toLowerCase().trim() === valId.toLowerCase().trim());
                      if (matched) {
                        return (
                          <div key={idx} className="bg-emerald-50 text-emerald-800 p-1 border border-emerald-100 rounded flex justify-between text-[10px]">
                            <span>🎯 matched: {matched.name} ({matched.classLevel})</span>
                            <span className="font-bold">Sc: {valSc}%</span>
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx} className="bg-amber-50 text-amber-800 p-1 border border-amber-100 rounded flex justify-between text-[10px]">
                            <span>❓ unregistered ID: "{valId}"</span>
                            <span className="font-bold">Sc: {valSc}%</span>
                          </div>
                        );
                      }
                    });
                  })()}
                </div>
              </div>
            </div>

            <div className="pt-1 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setBulkInputText("");
                  setBulkStatusMessage("");
                }}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 font-semibold cursor-pointer"
              >
                Reset Log Board
              </button>
              <button
                type="button"
                onClick={() => handleBulkUploadResultsSubmit(bulkInputText)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Publish Verified Results Set
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto text-[11px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-700 border-b uppercase text-[9px] tracking-wider">
                <th className="p-3 min-w-[200px]">Candidate Details</th>
                <th className="p-3 min-w-[220px]">Stage 1 (In-Campus Venue & Release)</th>
                <th className="p-3 text-center min-w-[170px]">Mains Selection</th>
                <th className="p-3 min-w-[220px]">Stage 2 Seating Location</th>
                <th className="p-3 text-right pr-6 min-w-[160px]">Stage 2 Mains Admit</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">No matching student logs recorded inside databases.</td>
                </tr>
              ) : (
                filteredStudents.map((st, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    
                    {/* Column 1: Candidate Details & Fee */}
                    <td className="p-3 space-y-1">
                      <p className="font-extrabold text-slate-900 text-xs">{st.name}</p>
                      <div className="font-mono text-[9px] text-slate-500">
                        {st.id} • <span className="font-sans font-semibold text-blue-700">{st.classLevel}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{st.email}</div>
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          st.paymentStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {st.paymentStatus}
                        </span>
                        {st.paymentStatus !== 'COMPLETED' && (
                          <button
                            type="button"
                            onClick={() => handleApproveCandidatePayment(st.id)}
                            className="text-[9px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-extrabold transition cursor-pointer"
                          >
                            Approve Cash
                          </button>
                        )}
                        {st.score !== undefined ? (
                          <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 border border-blue-100 rounded-full text-[9px] font-extrabold">
                            Score: {st.score}%
                          </span>
                        ) : (
                          <span className="bg-slate-50 text-slate-400 px-1.5 py-0.5 border border-slate-200 rounded-full text-[9px] font-bold">
                            No Score
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newScore = prompt(`Enter score (0-100) for ${st.name}:`, st.score !== undefined ? String(st.score) : "");
                            if (newScore !== null) {
                              const parsed = parseInt(newScore);
                              if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
                                handleUpdateScore(st.id, parsed);
                              } else {
                                alert("Please enter a valid percentage score from 0 to 100.");
                              }
                            }
                          }}
                          className="text-[9px] text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-bold transition flex items-center gap-0.5 cursor-pointer ml-1"
                        >
                          ✏️ {st.score !== undefined ? "Update" : "Add Result"}
                        </button>
                      </div>
                    </td>

                    {/* Column 2: Stage 1 Venue & Release */}
                    <td className="p-3 space-y-1">
                      <div className="text-slate-600 leading-tight">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Exam Venue (Same School)</span>
                        <span className="font-semibold text-slate-800 text-[11px] block max-w-[210px] truncate">{st.schoolName}</span>
                      </div>
                      
                      {st.paymentStatus !== 'COMPLETED' ? (
                        <span className="text-slate-400 text-[10px] italic block">🔒 Restricted (Awaiting Payment)</span>
                      ) : (
                        <div className="pt-1 flex items-center gap-2">
                          {st.stage1AdmitReleased ? (
                            <>
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 font-mono text-[10px] rounded font-bold">
                                Released: {st.stage1AdmitNumber || "PENDING"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStage1Release(st.id, false)}
                                className="text-[9px] bg-slate-100 hover:bg-slate-200 hover:text-red-700 text-slate-500 font-extrabold px-1.5 py-0.5 rounded transition cursor-pointer"
                              >
                                Lock
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 text-[10px] rounded font-bold">
                                Draft (Locked)
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStage1Release(st.id, true)}
                                className="text-[9px] bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-2 py-0.5 rounded transition cursor-pointer"
                              >
                                Release Admit
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Column 3: Mains Selection */}
                    <td className="p-3 text-center">
                      <div className="inline-flex flex-col gap-1 items-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-1.5 ${
                          st.qualificationStatus === 'QUALIFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          st.qualificationStatus === 'NOT_QUALIFIED' ? 'bg-red-100 text-red-800 border border-red-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {st.qualificationStatus === 'QUALIFIED' ? 'SELECTED (STAGE 2)' : 
                           st.qualificationStatus === 'NOT_QUALIFIED' ? 'PARTICIPATED ONLY' : 'TBD (MOCK EVAL)'}
                        </span>
                        
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleManualQualify(st.id, 'QUALIFIED')}
                            className={`px-2 py-1 rounded text-[9px] font-extrabold cursor-pointer transition ${
                              st.qualificationStatus === 'QUALIFIED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Select / Qualify
                          </button>
                          <button
                            type="button"
                            onClick={() => handleManualQualify(st.id, 'NOT_QUALIFIED')}
                            className={`px-2 py-1 rounded text-[9px] font-extrabold cursor-pointer transition ${
                              st.qualificationStatus === 'NOT_QUALIFIED' ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Disqualify
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Column 4: Stage 2 Center Allocation */}
                    <td className="p-3">
                      {st.qualificationStatus !== 'QUALIFIED' ? (
                        <span className="text-slate-400 italic text-[10px]">🔒 Locked (Candidate Unqualified)</span>
                      ) : (
                        <div className="space-y-1.5 max-w-[210px]">
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Exam Center Seating Allocation</span>
                          <Combobox
                            options={[{ value: "", label: "-- No Location Scheduled --" }, ...centers.map((center) => ({ value: center.id, label: `${center.name} (${center.city})` }))] }
                            value={st.examCenterId || ""}
                            onChange={(val) => handleAllocateCenter(st.id, val)}
                            placeholder="Select Center..."
                          />
                        </div>
                      )}
                    </td>

                    {/* Column 5: Stage 2 Admit Release Toggle */}
                    <td className="p-3 text-right pr-6">
                      {st.qualificationStatus !== 'QUALIFIED' ? (
                        <span className="text-slate-400 italic text-[10px]">🔒 Stage 2 Disabled</span>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5">
                          {st.stage2AdmitReleased ? (
                            <>
                              <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-300 font-mono text-[9px] rounded font-extrabold">
                                Released: {st.stage2AdmitNumber || "ENO-S2-RANDOM"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStage2Release(st.id, false)}
                                className="text-[9px] bg-slate-100 hover:bg-slate-200 hover:text-red-700 text-slate-500 font-extrabold px-1.5 py-0.5 rounded transition cursor-pointer"
                              >
                                Lock S2 Card
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 text-[9px] rounded font-bold">
                                Draft {st.examCenterId ? "(Seated)" : "(No Seat)"}
                              </span>
                              <button
                                type="button"
                                disabled={!st.examCenterId}
                                onClick={() => handleStage2Release(st.id, true)}
                                title={!st.examCenterId ? "Assign an exam center before releasing admit card" : ""}
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded transition cursor-pointer ${
                                  st.examCenterId 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                                }`}
                              >
                                Release S2 Mains
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
