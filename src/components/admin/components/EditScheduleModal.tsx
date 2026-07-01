import React from 'react';
import { X, Check, CheckCircle, ShieldAlert } from 'lucide-react';
import { School } from '../../../types';

interface EditScheduleModalProps {
  editingSchoolId: string | null;
  setEditingSchoolId: (id: string | null) => void;
  schools: School[];
  editPreExamDate: string;
  setEditPreExamDate: (val: string) => void;
  editPreExamTime: string;
  setEditPreExamTime: (val: string) => void;
  editPreExamDuration: string;
  setEditPreExamDuration: (val: string) => void;
  editSaveSuccess: string;
  editSaveError: string;
  editSaving: boolean;
  handleSaveSchoolSchedule: (e: React.FormEvent) => void;
}

export default function EditScheduleModal({
  editingSchoolId,
  setEditingSchoolId,
  schools,
  editPreExamDate,
  setEditPreExamDate,
  editPreExamTime,
  setEditPreExamTime,
  editPreExamDuration,
  setEditPreExamDuration,
  editSaveSuccess,
  editSaveError,
  editSaving,
  handleSaveSchoolSchedule
}: EditScheduleModalProps) {
  if (!editingSchoolId) return null;

  const currentSchoolName = schools.find(s => s.id === editingSchoolId)?.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 flex justify-between items-center">
          <div>
            <h4 className="font-bold font-display text-base">Edit School Exam Schedule</h4>
            <p className="text-[10px] text-blue-100 mt-0.5 font-mono">
              {currentSchoolName} ({editingSchoolId})
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditingSchoolId(null)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveSchoolSchedule} className="p-6 space-y-4 text-xs text-slate-700">
          {editSaveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{editSaveSuccess}</span>
            </div>
          )}

          {editSaveError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{editSaveError}</span>
            </div>
          )}

          <div className="space-y-3.5">
            <div>
              <label className="font-bold block mb-1">Pre-Exam Date</label>
              <input
                type="text"
                placeholder="e.g. July 28, 2026"
                required
                value={editPreExamDate}
                onChange={(e) => setEditPreExamDate(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Use formats like "July 28, 2026" or "YYYY-MM-DD" for proper status calculation.</p>
            </div>

            <div>
              <label className="font-bold block mb-1">Exam Start Time</label>
              <input
                type="text"
                placeholder="e.g. 11:00 AM"
                required
                value={editPreExamTime}
                onChange={(e) => setEditPreExamTime(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                placeholder="e.g. 120"
                min="10"
                required
                value={editPreExamDuration}
                onChange={(e) => setEditPreExamDuration(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setEditingSchoolId(null)}
              className="px-4 py-2 border rounded-xl font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editSaving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {editSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Schedule</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
