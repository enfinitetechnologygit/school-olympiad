import React from 'react';
import { Printer, Clock, User, CheckCircle2 } from 'lucide-react';
import { Student, School, ExamSchedule, ExamCenter } from '../../../types';

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

interface AdmitCardTabProps {
  student: Student;
  schoolInfo: School | null;
  schedule: ExamSchedule | null;
  centers: ExamCenter[];
  selectedAdmitStage: 1 | 2;
  setSelectedAdmitStage: (stage: 1 | 2) => void;
  isPrinting: boolean;
}

export default function AdmitCardTab({
  student,
  schoolInfo,
  isPrinting
}: AdmitCardTabProps) {
  const scheduledDate = schoolInfo?.examDate || schoolInfo?.preExamDate;
  const scheduledTime = schoolInfo?.examTime || schoolInfo?.preExamTime;
  const scheduledDuration = schoolInfo?.examDuration || schoolInfo?.preExamDuration || "60";

  return (
    <div className={isPrinting ? "" : "space-y-6 bg-white p-6 border rounded-2xl shadow-sm"}>
      {!isPrinting && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 shrink-0 gap-4 no-print">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-950">Official Olympiad Hall Ticket</h3>
            <p className="text-xs text-slate-500">
              One Olympiad Exam conducted in November. Exam date is mutually decided with your school.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print / Save Hall Ticket
          </button>
        </div>
      )}

      <div className="max-w-2xl mx-auto border-4 border-double border-slate-400 bg-white p-6 space-y-6" id="admit-card-printable">
        {/* Badge and Title */}
        <div className="text-center pb-4 border-b-2 border-dashed space-y-3 flex flex-col items-center">
          <img src="/logo.png?v=3" alt="Enfinite National Olympiad Logo" className="h-16 w-auto object-contain" />
          <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-300 text-xs rounded-full uppercase tracking-wider shadow-sm">
            November Olympiad Official Hall Ticket • Free Registration
          </div>
        </div>

        {/* Core details card block */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="col-span-1 bg-slate-50 border border-slate-300 rounded aspect-square flex items-center justify-center p-4">
            {student.photo ? (
              <img src={student.photo} alt={student.name} className="w-full h-full object-cover rounded" />
            ) : (
              <div className="text-center text-slate-400">
                <User className="w-10 h-10 text-slate-400 mx-auto" />
                <span className="text-[9px] font-bold block mt-1 uppercase">Candidate Photo</span>
              </div>
            )}
          </div>

          <div className="col-span-1 sm:col-span-3 grid grid-cols-2 gap-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Student Candidate Name</span>
              <p className="font-extrabold text-slate-900 text-[13px]">{student.name}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Candidate Roll / Unique ID</span>
              <p className="font-mono font-black text-blue-600 text-sm">{student.id}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Olympiad Class Standard</span>
              <p className="font-bold text-slate-900">{student.classLevel} Division</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">School Institution</span>
              <p className="font-sans text-slate-700 font-bold">{student.schoolName}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Registration Fee</span>
              <p className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                100% FREE
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Admit Card Number</span>
              <p className="font-mono font-bold text-slate-800">{student.admitCardNumber || student.stage1AdmitNumber || "ENO-AC-83921"}</p>
            </div>
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Date, Timing, allocated Center */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 p-4 rounded-lg bg-slate-50 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Scheduled Date</span>
            <p className="font-black text-slate-950 mt-0.5">
              {scheduledDate ? formatDateToDMY(scheduledDate) : "November 2026"}
            </p>
            <p className="text-[10px] text-blue-600 font-semibold">
              {scheduledDate ? `Time: ${scheduledTime || "10:00 AM"}` : "Mutually Scheduled with School"}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Duration</span>
            <p className="font-black text-slate-950 mt-0.5">{scheduledDuration} Minutes</p>
            <p className="text-[10px] text-slate-500">Standard Olympiad timing</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allocated Exam Venue</span>
            <p className="font-extrabold text-slate-950 mt-0.5 text-[11px] leading-tight">
              {student.schoolName}
            </p>
            <p className="text-[9px] text-blue-700 font-semibold mt-0.5">In-Campus School Premises</p>
          </div>
        </div>

        {/* Rules of conduct */}
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Olympiad Examination Code of Conduct</h5>
          <ul className="list-decimal list-inside text-[9px] text-slate-600 space-y-1">
            <li>Candidate must present this printed hall ticket on the exam date.</li>
            <li>Examination will be held in November at your enrolled school campus as per the schedule decided with school authorities.</li>
            <li>Exam is administered under close supervision of the designated school coordinator.</li>
            <li>Valid school identification badge or card is required during the examination.</li>
          </ul>
        </div>

        {/* Footer signature lines */}
        <div className="border-t pt-4 flex justify-between items-center text-xs">
          <div>
            <span className="text-[9px] text-slate-400 block font-mono">Board Authorization:</span>
            <span className="font-mono text-emerald-600 font-extrabold text-[10px]">VERIFIED FREE ENTRY</span>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-slate-400 block font-mono">Olympiad Scholastic Registrar</span>
            <p className="font-display font-semibold text-slate-950 text-xs italic tracking-wider mt-1 block">Deepak Gola</p>
          </div>
        </div>
      </div>
    </div>
  );
}
