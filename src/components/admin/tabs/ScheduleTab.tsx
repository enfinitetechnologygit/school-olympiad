import React from 'react';
import { Calendar, CheckCircle, ShieldAlert, Check, Search, Building } from 'lucide-react';
import { ExamSchedule, School } from '../../../types';
import Combobox from '../../ui/Combobox';
import DatePicker from '../../ui/DatePicker';

const formatDateToDMY = (dateStr?: string): string => {
  if (!dateStr || dateStr.trim() === '') return '';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  const parsed = Date.parse(dateStr);
  if (isNaN(parsed)) return dateStr;
  const d = new Date(parsed);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${month}-${d.getFullYear()}`;
};

const formatDateToInput = (dateStr?: string): string => {
  if (!dateStr || dateStr.trim() === '') return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = Date.parse(dateStr);
  if (isNaN(parsed)) return '';
  const d = new Date(parsed);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

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
      
      {/* TOP: NOVEMBER OLYMPIAD MASTER SCHEDULE OVERVIEW */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-950">November Olympiad Master Schedule</h3>
            <p className="text-xs text-slate-500 mt-1">There is only one Olympiad exam, conducted in November. Set and update the exact exam date mutually with each participating school below.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold font-mono tracking-wider text-[10px] rounded-full uppercase">
            <Calendar className="w-3.5 h-3.5" />
            November Exam Controller
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

        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed font-medium">
          <strong>Mutual Scheduling Note:</strong> Each participating school can have a customized exam date in November. Select any school from the directory table below and click <strong>"Edit Schedule"</strong> to set or update its official exam date, start time, and duration.
        </div>
      </div>

      {/* BOTTOM: SCHOOL NOVEMBER EXAM SCHEDULES LIST & FILTERS */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-950">School November Exam Schedules</h3>
            <p className="text-xs text-slate-500 mt-1">Manage independent November exam schedules for each approved school. Students will see the exact schedule set for their school.</p>
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
              <Combobox
                options={[
                  { value: "All", label: "All Statuses" },
                  { value: "Not Scheduled", label: "Not Scheduled" },
                  { value: "Upcoming", label: "Upcoming" },
                  { value: "Active", label: "Active" },
                  { value: "Completed", label: "Completed" }
                ]}
                value={scheduleStatusFilter}
                onChange={(val) => setScheduleStatusFilter(val)}
                placeholder="Choose Status..."
              />
            </div>

            {/* Date Range Start */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Start Date Range</label>
              <DatePicker
                value={scheduleStartDateFilter}
                onChange={(val) => setScheduleStartDateFilter(val)}
                placeholder="Start Date"
              />
            </div>

            {/* Date Range End */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">End Date Range</label>
              <DatePicker
                value={scheduleEndDateFilter}
                onChange={(val) => setScheduleEndDateFilter(val)}
                placeholder="End Date"
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
        <div className="overflow-x-auto rounded-2xl border border-slate-150 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-900 text-white font-extrabold uppercase tracking-widest text-[10px]">
                <th className="p-4 pl-6">School ID & Name</th>
                <th className="p-4">Pre-Exam Date</th>
                <th className="p-4">Time & Duration</th>
                <th className="p-4">Exam Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
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
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                      Not Scheduled
                    </span>
                  );
                  if (status === 'Upcoming') {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                        Upcoming
                      </span>
                    );
                  } else if (status === 'Active') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-250 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Active
                      </span>
                    );
                  } else if (status === 'Completed') {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-50 text-purple-750 border border-purple-250">
                        Completed
                      </span>
                    );
                  }

                  return (
                    <tr key={sch.id} className="hover:bg-blue-50/20 transition duration-150">
                      <td className="p-4 pl-6">
                        <div className="font-black text-slate-900 text-sm">{sch.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-bold mt-1">{sch.id} | Coordinator: {sch.coordinatorName || 'N/A'}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {sch.preExamDate ? formatDateToDMY(sch.preExamDate) : (
                          <span className="text-slate-400 italic">Not Scheduled</span>
                        )}
                      </td>
                      <td className="p-4">
                        {sch.preExamDate ? (
                          <div>
                            <div className="font-extrabold text-slate-900">{sch.preExamTime || 'N/A'}</div>
                            <div className="text-[10px] text-slate-400 font-bold mt-0.5">{sch.preExamDuration ? `${sch.preExamDuration} minutes` : 'N/A'}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="p-4">{statusBadge}</td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleEditScheduleClick(sch)}
                          className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold border border-blue-200 rounded-xl transition cursor-pointer shadow-sm text-xs"
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
