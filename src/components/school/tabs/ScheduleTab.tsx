import React from 'react';
import { Calendar } from 'lucide-react';
import { School } from '../../../types';

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

interface ScheduleTabProps {
  school: School;
}

export default function ScheduleTab({ school }: ScheduleTabProps) {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h4 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Pre-Exam Schedule Desk
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              View your school's custom, independent Pre-Exam timings assigned by the Olympiad Board.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold font-mono tracking-wider text-[10px] rounded-full uppercase">
            School-Specific Setup
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Status</span>
              <h5 className="font-extrabold text-slate-800 text-base mt-1">
                {(() => {
                  if (!school.preExamDate || school.preExamDate.trim() === '') return 'Not Scheduled';
                  const parsed = Date.parse(school.preExamDate);
                  if (isNaN(parsed)) return 'Not Scheduled';
                  const examDate = new Date(parsed);
                  examDate.setHours(0,0,0,0);
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  if (examDate.getTime() === today.getTime()) return 'Active';
                  if (examDate.getTime() > today.getTime()) return 'Upcoming';
                  return 'Completed';
                })()}
              </h5>
            </div>
            <div className="mt-4">
              {(() => {
                const s = (() => {
                  if (!school.preExamDate || school.preExamDate.trim() === '') return 'Not Scheduled';
                  const parsed = Date.parse(school.preExamDate);
                  if (isNaN(parsed)) return 'Not Scheduled';
                  const examDate = new Date(parsed);
                  examDate.setHours(0,0,0,0);
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  if (examDate.getTime() === today.getTime()) return 'Active';
                  if (examDate.getTime() > today.getTime()) return 'Upcoming';
                  return 'Completed';
                })();

                if (s === 'Not Scheduled') {
                  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">Waiting for schedule from Board</span>;
                } else if (s === 'Upcoming') {
                  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Upcoming Olympiad Pre-Exam</span>;
                } else if (s === 'Active') {
                  return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Currently Active
                    </span>
                  );
                } else {
                  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Exam completed</span>;
                }
              })()}
            </div>
          </div>

          {/* Timing Card */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl col-span-2 space-y-4">
            <h5 className="font-extrabold text-slate-800 text-sm font-display border-b pb-2">Pre-Exam Timing Details</h5>
            {school.preExamDate ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white border rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pre-Exam Date</span>
                  <span className="font-bold text-slate-900">{formatDateToDMY(school.preExamDate)}</span>
                </div>
                <div className="bg-white border rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</span>
                  <span className="font-bold text-slate-900">{school.preExamTime || 'N/A'}</span>
                </div>
                <div className="bg-white border rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</span>
                  <span className="font-bold text-slate-900">{school.preExamDuration ? `${school.preExamDuration} minutes` : 'N/A'}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold">
                No Pre-Exam timings have been set by the administrator for your school yet. Once scheduled, your students will see the date/time on their admit card and receive email notifications.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
