import React from 'react';
import { Printer, Clock, AlertCircle, Trophy, User } from 'lucide-react';
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
  schedule,
  centers,
  selectedAdmitStage,
  setSelectedAdmitStage,
  isPrinting
}: AdmitCardTabProps) {
  return (
    <div className={isPrinting ? "" : "space-y-6 bg-white p-6 border rounded-2xl shadow-sm"}>
      {!isPrinting && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 shrink-0 gap-4 no-print">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-950">Official Scholastic Admit Portal</h3>
            <p className="text-xs text-slate-500">Access stage-wise hall tickets. Stage 1 is held at your school; Stage 2 is at allocated external test centers.</p>
          </div>
          
          {student.paymentStatus === 'COMPLETED' && (
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 cursor-pointer select-none"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print / Save PDF
            </button>
          )}
        </div>
      )}

      {/* Stage Select Segmented Control */}
      {!isPrinting && (
        <div className="flex border-b border-slate-100 pb-1 gap-4 shrink-0 no-print" id="admit-stage-tabs">
          <button
            type="button"
            onClick={() => setSelectedAdmitStage(1)}
            className={`pb-2 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              selectedAdmitStage === 1
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Stage 1: Pre-Exam (In-Campus Venue)
          </button>
          <button
            type="button"
            onClick={() => setSelectedAdmitStage(2)}
            className={`pb-2 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              selectedAdmitStage === 2
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Stage 2: Mains Challenge (Exam Center)
          </button>
        </div>
      )}

      {student.paymentStatus !== 'COMPLETED' ? (
        <div className="p-8 bg-red-50 text-red-800 text-center rounded-xl border border-red-100 space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-sm font-semibold">Payment Incomplete</p>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            Secure credentials cannot be issued before payment authorization. Please complete your registration under the Overview module.
          </p>
        </div>
      ) : selectedAdmitStage === 1 ? (
        // --- STAGE 1 HALL TICKET VIEW ---
        (!schoolInfo || !schoolInfo.preExamDate || !schoolInfo.preExamTime || !schoolInfo.preExamDuration) ? (
          <div className="p-10 bg-slate-50 text-center rounded-xl border border-slate-200 py-12 space-y-4" id="waiting-schedule-alert">
            <Clock className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
            <div>
              <p className="text-sm font-bold text-slate-800">Waiting for Exam Schedule</p>
              <p className="text-xs text-slate-500 mt-1">The official date, time, and duration for your school's Pre-Exam have not yet been scheduled by the administrator.</p>
            </div>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed border-t border-slate-200/60 pt-3">
              Your admit card will be automatically activated and details populated once your school's schedule is released. Please check back soon.
            </p>
          </div>
        ) : !student.stage1AdmitReleased ? (
          <div className="p-10 bg-slate-50 text-center rounded-xl border border-slate-200 py-12 space-y-3">
            <Clock className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
            <p className="text-sm font-semibold text-slate-800">Stage 1 Admit Card Processing</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your Stage 1 Admit details are being indexed by your school coordinator. Hall ticket downloads are auto-activated instantly once unlocked by the admin.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto border-4 border-double border-slate-400 bg-white p-6 space-y-6" id="admit-card-printable">
            {/* Badge and Title */}
            <div className="text-center pb-4 border-b-2 border-dashed space-y-3 flex flex-col items-center">
              <img src="/logo.png?v=3" alt="Enfinite National Olympiad Logo" className="h-16 w-auto object-contain" />
              <div className="inline-block px-4 py-1 bg-blue-50 text-blue-700 font-bold border border-blue-200 text-xs rounded uppercase tracking-wider">
                Stage 1 Pre-Exam Entry Hall Ticket
              </div>
            </div>

            {/* Core details card block */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="col-span-1 bg-slate-50 border border-slate-300 rounded aspect-square flex items-center justify-center p-4">
                <div className="text-center text-slate-400">
                  <User className="w-10 h-10 text-slate-400 mx-auto" />
                  <span className="text-[9px] font-bold block mt-1 uppercase">Photo Annexed</span>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3 grid grid-cols-2 gap-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Student Candidate Name</span>
                  <p className="font-extrabold text-slate-900 text-[13px]">{student.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Student Unique ID</span>
                  <p className="font-mono font-black text-blue-600 text-sm">{student.id}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Olympiad Class Standard</span>
                  <p className="font-bold text-slate-900">{student.classLevel} Division</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">School Name</span>
                  <p className="font-sans text-slate-700 font-bold">{student.schoolName}</p>
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Date, Timing, allocated Center */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 p-4 rounded-lg bg-slate-50 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Scheduled Date</span>
                <p className="font-black text-slate-950 mt-0.5">{formatDateToDMY(schoolInfo?.preExamDate)}</p>
                <p className="text-[10px] text-slate-500">Exam Time: {schoolInfo?.preExamTime}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Duration</span>
                <p className="font-black text-slate-950 mt-0.5">{schoolInfo?.preExamDuration} Minutes</p>
                <p className="text-[10px] text-slate-500">Standard Olympiad timing</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allocated Proctoring Venue</span>
                <p className="font-extrabold text-slate-950 mt-0.5 text-[11px] leading-tight">
                  {student.schoolName}
                </p>
                <p className="text-[9px] text-blue-700 font-semibold mt-0.5">In-Campus (Same School Venue)</p>
              </div>
            </div>

            {/* Rules of conduct */}
            <div className="space-y-2">
              <h5 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Stage 1 Scholastic Code of Conduct</h5>
              <ul className="list-decimal list-inside text-[9px] text-slate-600 space-y-1">
                <li>Student must paste their original photo in photo holder.</li>
                <li>Candidates must write Stage-1 examinations within their original enrolled school campus premises.</li>
                <li>Exam is administered offline under close supervision of the local school designated coordinator.</li>
                <li>Valid school identification badge or card is required to be held on table throughout proctored timings.</li>
              </ul>
            </div>

            {/* Footer signature lines */}
            <div className="border-t pt-4 flex justify-between items-center text-xs">
              <div>
                <span className="text-[9px] text-slate-400 block font-mono">Issued by Verification ID:</span>
                <span className="font-mono text-slate-700 font-extrabold text-[10px]">{student.paymentId}</span>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-mono">Olympiad Scholastic Registrar</span>
                <p className="font-display font-semibold text-slate-950 text-xs italic tracking-wider mt-1 block">Deepak Gola</p>
              </div>
            </div>
          </div>
        )
      ) : (
        // --- STAGE 2 HALL TICKET VIEW ---
        (!schedule || !schedule.mainExamDate || !schedule.mainExamTime || !schedule.mainExamDuration) ? (
          <div className="p-10 bg-slate-50 text-center rounded-xl border border-slate-200 py-12 space-y-4" id="waiting-schedule-alert">
            <Clock className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
            <div>
              <p className="text-sm font-bold text-slate-800">Waiting for Exam Schedule</p>
              <p className="text-xs text-slate-500 mt-1">The official date, time, and duration for the Stage 2 Mains Exam have not yet been scheduled by the administrator.</p>
            </div>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed border-t border-slate-200/60 pt-3">
              Your admit card will be automatically activated and details populated once the global Stage 2 schedule is released. Please check back soon.
            </p>
          </div>
        ) : student.qualificationStatus !== 'QUALIFIED' ? (
          <div className="p-10 bg-slate-50 text-center rounded-xl border border-slate-200 py-12 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Stage 2 Restricted</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Only students who are selected and successfully qualify through the prelim Stage 1 examination scoring are cleared to achieve a Stage 2 Mains Admit card.
            </p>
          </div>
        ) : !student.stage2AdmitReleased ? (
          <div className="p-10 bg-blue-50/50 text-center rounded-xl border border-blue-100 py-12 space-y-4">
            <Trophy className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
            <div>
              <p className="text-sm font-bold text-blue-900">🎉 Congratulations on Qualifying!</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Your selection for the Stage 2 Mains Challenge is CONFIRMED.</p>
            </div>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed border-t border-blue-100/60 pt-3">
              Your seating plan is currently being finalized at your city's authorized external test venue. Once allocated and approved by the State Registrar, your Mains Hall Ticket will trigger here immediately.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto border-4 border-double border-blue-500 bg-white p-6 space-y-6" id="admit-card-printable">
            {/* Badge and Title */}
            <div className="text-center pb-4 border-b-2 border-dashed space-y-3 flex flex-col items-center">
              <img src="/logo.png?v=3" alt="Enfinite National Olympiad Logo" className="h-16 w-auto object-contain" />
              <div className="inline-block px-4 py-1 bg-amber-500 text-white font-black text-xs rounded uppercase tracking-wider">
                Stage 2 Mains Entry Hall Ticket
              </div>
            </div>

            {/* Core details card block */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="col-span-1 bg-blue-50 border border-blue-200 rounded aspect-square flex items-center justify-center p-4">
                <div className="text-center text-blue-500">
                  <Trophy className="w-10 h-10 text-amber-500 mx-auto" />
                  <span className="text-[9px] font-bold block mt-1 uppercase text-blue-800">Mains Elite</span>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3 grid grid-cols-2 gap-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Selected Candidate Name</span>
                  <p className="font-extrabold text-slate-900 text-[13px]">{student.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Student Unique ID</span>
                  <p className="font-mono font-black text-amber-600 text-sm">{student.id}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Olympiad Class Standard</span>
                  <p className="font-bold text-slate-900">{student.classLevel} Division</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">School Name</span>
                  <p className="font-sans text-slate-700 font-bold">{student.schoolName}</p>
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Date, Timing, allocated Center */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-blue-100 p-4 rounded-lg bg-blue-50/40 text-xs">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Mains Exam Scheduled Date</span>
                <p className="font-black text-slate-950 mt-0.5">{formatDateToDMY(schedule?.mainExamDate)}</p>
                <p className="text-[10px] text-slate-500">Exam Time: {schedule?.mainExamTime}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Exam Duration</span>
                <p className="font-black text-slate-950 mt-0.5">{schedule?.mainExamDuration} Minutes (Mains)</p>
                <p className="text-[10px] text-slate-500">Advanced Olympiad timing</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Allocated External Center</span>
                <p className="font-black text-slate-950 mt-0.5 text-[11px] leading-tight">
                  {(() => {
                    const found = centers.find(c => c.id === student.examCenterId);
                    return found ? `${found.name}, ${found.city}` : "External Exam Center (Scheduled)";
                  })()}
                </p>
                <p className="text-[9px] text-amber-600 font-bold mt-0.5">Verified Seat Allocation</p>
              </div>
            </div>

            {/* Rules of conduct */}
            <div className="space-y-2">
              <h5 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Stage 2 Mains Official Instructions</h5>
              <ul className="list-decimal list-inside text-[9px] text-slate-600 space-y-1">
                <li>Student must paste their original photo in photo holder.</li>
                <li>Stage 2 must be taken in-person at the specified external test center venue. No home-school bypass is permitted.</li>
                <li>Heavy biometric verification will be triggered at entry gates. Bring this printed card and government registration copy.</li>
                <li>Strict non-smart device guidelines will be held active under direct external center proctors.</li>
              </ul>
            </div>

            {/* Footer signature lines */}
            <div className="border-t pt-4 flex justify-between items-center text-xs">
              <div>
                <span className="text-[9px] text-slate-400 block font-mono">Issued by Verification ID:</span>
                <span className="font-mono text-slate-700 font-extrabold text-[10px]">{student.paymentId}</span>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-mono">Olympiad Scholastic Registrar</span>
                <p className="font-display font-semibold text-slate-950 text-xs italic tracking-wider mt-1 block">Deepak Gola</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
