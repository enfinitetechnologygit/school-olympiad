import React from 'react';
import { Calendar, CheckCircle, ShieldAlert, Check, Search, Building } from 'lucide-react';
import { ExamSchedule, School } from '../../../types';

interface ScheduleTabProps {
  schedule: ExamSchedule;
  setSchedule: React.Dispatch<React.SetStateAction<ExamSchedule>>;
  scheduleSuccess: string;
  setScheduleSuccess: (val: string) => void;
  scheduleError: string;
  setScheduleError: (val: string) => void;
  scheduleSaving: boolean;
  setScheduleSaving: (val: boolean) => void;
  handleSaveSchedule: (e: React.FormEvent) => void;
  schools: School[];
  getSchoolExamStatus: (school: School) => string;
  scheduleSearchFilter: string;
  setScheduleSearchFilter: (val: string) => void;
  scheduleStatusFilter: string;
  setScheduleStatusFilter: (val: string) => void;
  scheduleStartDateFilter: string;
  setScheduleStartDateFilter: (val: string) => void;
  scheduleEndDateFilter: string;
  setScheduleEndDateFilter: (val: string) => void;
  handleEditScheduleClick: (school: School) => void;
}

export default function ScheduleTab({
  schedule,
  setSchedule,
  scheduleSuccess,
  setScheduleSuccess,
  scheduleError,
  setScheduleError,
  scheduleSaving,
  setScheduleSaving,
  handleSaveSchedule,
  schools,
  getSchoolExamStatus,
  scheduleSearchFilter,
  setScheduleSearchFilter,
  scheduleStatusFilter,
  setScheduleStatusFilter,
  scheduleStartDateFilter,
  setScheduleStartDateFilter,
  scheduleEndDateFilter,
  setScheduleEndDateFilter,
  handleEditScheduleClick
}: ScheduleTabProps) {
  const filteredSchoolsForScheduling = schools.filter(school => {
    if (school.status !== 'APPROVED') return false;

    // Search filter
    if (scheduleSearchFilter) {
      const term = scheduleSearchFilter.toLowerCase();
      if (!school.name.toLowerCase().includes(term) && 
          !school.id.toLowerCase().includes(term) && 
          !(school.coordinatorName || '').toLowerCase().includes(term)) {
        return false;
      }
    }

    // Status filter
    const status = getSchoolExamStatus(school);
    if (scheduleStatusFilter !== 'All' && status !== scheduleStatusFilter) {
      return false;
    }

    // Date range filter
    if (school.preExamDate) {
      const parsedDate = Date.parse(school.preExamDate);
      if (!isNaN(parsedDate)) {
        const examTime = new Date(parsedDate).getTime();
        if (scheduleStartDateFilter) {
          const startLimit = new Date(scheduleStartDateFilter).getTime();
          if (examTime < startLimit) return false;
        }
        if (scheduleEndDateFilter) {
          const endLimit = new Date(scheduleEndDateFilter).getTime();
          if (examTime > endLimit) return false;
        }
      } else if (scheduleStartDateFilter || scheduleEndDateFilter) {
        return false;
      }
    } else if (scheduleStartDateFilter || scheduleEndDateFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in pb-12">
      
      {/* TOP: GLOBAL STAGE 2 MAINS SCHEDULE */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-950">Global Stage 2 (Mains) Schedule</h3>
            <p className="text-xs text-slate-500 mt-1">Configure official dates, timings, and durations for the global Stage 2 Mains Exam (held at external venues).</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold font-mono tracking-wider text-[10px] rounded-full uppercase">
            <Calendar className="w-3.5 h-3.5" />
            Mains Controller
          </div>
        </div>

        {scheduleSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-pulse" id="schedule-success-alert">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{scheduleSuccess}</span>
          </div>
        )}

        {scheduleError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2.5 text-xs font-semibold" id="schedule-error-alert">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{scheduleError}</span>
          </div>
        )}

        <form onSubmit={handleSaveSchedule} className="space-y-6 text-xs text-slate-700">
          <div className="bg-slate-50/60 border border-slate-200 p-5 rounded-2xl space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 border-b pb-2">
              <div className="bg-amber-500 text-white p-1 rounded-lg">
                <span className="font-bold px-1 text-[10px]">S2</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm font-display">Stage 2: Main Exam (External Venue)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold block mb-1">Mains Exam Date</label>
                <input
                  id="input-main-date"
                  type="text"
                  placeholder="e.g. September 15, 2026"
                  value={schedule.mainExamDate || ''}
                  onChange={(e) => setSchedule(prev => ({ ...prev, mainExamDate: e.target.value }))}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Exam Start Time</label>
                <input
                  id="input-main-time"
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={schedule.mainExamTime || ''}
                  onChange={(e) => setSchedule(prev => ({ ...prev, mainExamTime: e.target.value }))}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Duration (Minutes)</label>
                <input
                  id="input-main-duration"
                  type="number"
                  min="10"
                  placeholder="e.g. 180"
                  value={schedule.mainExamDuration || ''}
                  onChange={(e) => setSchedule(prev => ({ ...prev, mainExamDuration: e.target.value }))}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 max-w-2xl text-xs">
            <button
              type="button"
              id="btn-schedule-clear"
              onClick={async () => {
                const cleared = {
                  ...schedule,
                  mainExamDate: '',
                  mainExamTime: '',
                  mainExamDuration: ''
                };
                setScheduleSaving(true);
                setScheduleSuccess('');
                setScheduleError('');
                try {
                  const res = await fetch('/api/exam-schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cleared)
                  });
                  const data = await res.json();
                  if (res.ok && data.status === 'success') {
                    setScheduleSuccess('Stage 2 Mains schedule settings reset/cleared successfully.');
                    setSchedule(data.schedule);
                  } else {
                    setScheduleError('Failed to clear Mains schedule.');
                  }
                } catch (err: any) {
                  setScheduleError(err.message || 'Error occurred clearing schedule.');
                } finally {
                  setScheduleSaving(false);
                }
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border rounded-xl text-slate-700 font-bold tracking-wide transition cursor-pointer select-none"
            >
              Clear Mains Schedule Details
            </button>

            <button
              type="submit"
              id="btn-schedule-save"
              disabled={scheduleSaving}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border border-indigo-500 text-white font-extrabold text-sm rounded-xl tracking-wide shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {scheduleSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Timings...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Publish Stage 2 Schedule & Release Admit Cards</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* BOTTOM: SCHOOL PRE-EXAM SCHEDULES LIST & FILTERS */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-950">School Pre-Exam Schedules</h3>
            <p className="text-xs text-slate-500 mt-1">Manage independent Pre-Exam schedules for each approved school. Students will only see schedules assigned to their registered school.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-bold font-mono tracking-wider text-[10px] rounded-full uppercase">
            <Building className="w-3.5 h-3.5" />
            School-wise Setup
          </div>
        </div>

        {/* Filters Row */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
          <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Filters & Controls</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Search Schools</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, ID..."
                  value={scheduleSearchFilter}
                  onChange={(e) => setScheduleSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-slate-955 font-medium outline-none text-xs"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Exam Status</label>
              <select
                value={scheduleStatusFilter}
                onChange={(e) => setScheduleStatusFilter(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-slate-950 font-medium outline-none text-xs font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Not Scheduled">Not Scheduled</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Date Range Start */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Start Date Range</label>
              <input
                type="date"
                value={scheduleStartDateFilter}
                onChange={(e) => setScheduleStartDateFilter(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-slate-950 font-medium outline-none text-xs"
              />
            </div>

            {/* Date Range End */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">End Date Range</label>
              <input
                type="date"
                value={scheduleEndDateFilter}
                onChange={(e) => setScheduleEndDateFilter(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-slate-955 font-medium outline-none text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setScheduleSearchFilter('');
                setScheduleStatusFilter('All');
                setScheduleStartDateFilter('');
                setScheduleEndDateFilter('');
              }}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-[10px] transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-xl bg-white shadow-sm text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-3">School ID & Name</th>
                <th className="p-3">Pre-Exam Date</th>
                <th className="p-3">Time & Duration</th>
                <th className="p-3">Exam Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium text-xs">
              {filteredSchoolsForScheduling.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">
                    No schools found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredSchoolsForScheduling.map((sch) => {
                  const status = getSchoolExamStatus(sch);
                  
                  // Style helper for status badges
                  let statusBadge = (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      Not Scheduled
                    </span>
                  );
                  if (status === 'Upcoming') {
                    statusBadge = (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Upcoming
                      </span>
                    );
                  } else if (status === 'Active') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Active
                      </span>
                    );
                  } else if (status === 'Completed') {
                    statusBadge = (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        Completed
                      </span>
                    );
                  }

                  return (
                    <tr key={sch.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{sch.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{sch.id} | Coordinator: {sch.coordinatorName || 'N/A'}</div>
                      </td>
                      <td className="p-3 font-semibold">
                        {sch.preExamDate ? sch.preExamDate : (
                          <span className="text-slate-400 italic">Not Scheduled</span>
                        )}
                      </td>
                      <td className="p-3">
                        {sch.preExamDate ? (
                          <div>
                            <div className="font-semibold text-slate-900">{sch.preExamTime || 'N/A'}</div>
                            <div className="text-[10px] text-slate-500">{sch.preExamDuration ? `${sch.preExamDuration} minutes` : 'N/A'}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="p-3">{statusBadge}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleEditScheduleClick(sch)}
                          className="px-3 py-1.5 bg-blue-55 bg-blue-50 hover:bg-blue-100 text-blue-750 text-blue-700 font-bold border border-blue-200 rounded-lg transition cursor-pointer"
                        >
                          Edit Schedule
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
