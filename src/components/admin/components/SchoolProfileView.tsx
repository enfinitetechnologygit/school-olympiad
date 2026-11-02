import React from 'react';
import { ArrowLeft, User, Phone, Mail, MapPin, BookOpen, Calendar, Award, Search } from 'lucide-react';
import { School, Student } from '../../../types';
import Combobox from '../../ui/Combobox';

interface SchoolProfileViewProps {
  selectedSchoolProfile: School | null;
  setSelectedSchoolProfile: (school: School | null) => void;
  handleRejectSchool: (schoolId: string) => void;
  handleApproveSchool: (schoolId: string) => void;
  handleDeleteSchool: (schoolId: string) => void;
  fetchAdminData: () => Promise<void>;
  passingMarksEdit: Record<string, number>;
  setPassingMarksEdit: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  savingPassingMarks: boolean;
  passingMarksSuccess: string;
  passingMarksError: string;
  handleSavePassingMarks: (e: React.FormEvent) => void;
  schoolRosterSearch: string;
  setSchoolRosterSearch: (val: string) => void;
  schoolRosterClassFilter: string;
  setSchoolRosterClassFilter: (val: string) => void;
  students: Student[];
  handleApproveCandidatePayment?: (studentId: string) => void;
  handleUpdateScore: (studentId: string, score: number) => void;
}

export default function SchoolProfileView({
  selectedSchoolProfile,
  setSelectedSchoolProfile,
  handleRejectSchool,
  handleApproveSchool,
  handleDeleteSchool,
  fetchAdminData,
  passingMarksEdit,
  setPassingMarksEdit,
  savingPassingMarks,
  passingMarksSuccess,
  passingMarksError,
  handleSavePassingMarks,
  schoolRosterSearch,
  setSchoolRosterSearch,
  schoolRosterClassFilter,
  setSchoolRosterClassFilter,
  students,
  handleUpdateScore
}: SchoolProfileViewProps) {
  const [schDate, setSchDate] = React.useState<string>('');
  const [schTime, setSchTime] = React.useState<string>('');
  const [schDuration, setSchDuration] = React.useState<string>('120');
  const [schSaving, setSchSaving] = React.useState<boolean>(false);
  const [schSuccess, setSchSuccess] = React.useState<string>('');
  const [schError, setSchError] = React.useState<string>('');

  React.useEffect(() => {
    if (selectedSchoolProfile) {
      const existingDate = selectedSchoolProfile.examDate || selectedSchoolProfile.preExamDate || '';
      let dateVal = existingDate;
      if (existingDate && !/^\d{4}-\d{2}-\d{2}$/.test(existingDate)) {
        const parsed = Date.parse(existingDate);
        if (!isNaN(parsed)) {
          const d = new Date(parsed);
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          dateVal = `${d.getFullYear()}-${month}-${day}`;
        }
      }
      setSchDate(dateVal);
      setSchTime(selectedSchoolProfile.examTime || selectedSchoolProfile.preExamTime || '10:00 AM');
      setSchDuration(selectedSchoolProfile.examDuration || selectedSchoolProfile.preExamDuration || '120');
    }
  }, [selectedSchoolProfile]);

  if (!selectedSchoolProfile) return null;

  const handleSaveSchoolExamSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchSaving(true);
    setSchSuccess('');
    setSchError('');

    try {
      const res = await fetch(`/api/schools/${selectedSchoolProfile.id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examDate: schDate,
          examTime: schTime,
          examDuration: schDuration,
          preExamDate: schDate,
          preExamTime: schTime,
          preExamDuration: schDuration
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSchSuccess('November Olympiad exam date updated and notification dispatched!');
        fetchAdminData();
      } else {
        setSchError(data.error || 'Failed to save exam date.');
      }
    } catch (err: any) {
      setSchError(err.message || 'Network error updating exam schedule.');
    } finally {
      setSchSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedSchoolProfile(null)}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer select-none border bg-white px-3 py-1.5 rounded-lg shadow-sm focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard Directory
        </button>

        <div className="flex gap-2">
          {selectedSchoolProfile.status === 'PENDING' && (
            <>
              <button
                onClick={() => {
                  handleRejectSchool(selectedSchoolProfile.id);
                  setSelectedSchoolProfile(null);
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-extrabold px-3 py-1.5 rounded-lg transition text-xs cursor-pointer border border-red-200"
              >
                Reject Request
              </button>
              <button
                onClick={async () => {
                  await handleApproveSchool(selectedSchoolProfile.id);
                  setSelectedSchoolProfile(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-lg transition text-xs cursor-pointer"
              >
                Approve School
              </button>
            </>
          )}
          {selectedSchoolProfile.status === 'APPROVED' && (
            <button
              onClick={async () => {
                await handleDeleteSchool(selectedSchoolProfile.id);
                setSelectedSchoolProfile(null);
              }}
              className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-extrabold px-3 py-1.5 rounded-lg transition text-xs cursor-pointer border border-red-200"
            >
              Delete School
            </button>
          )}
        </div>
      </div>

      {/* Profile Card Header */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-slate-900">{selectedSchoolProfile.name}</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
              selectedSchoolProfile.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              selectedSchoolProfile.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-amber-100 text-amber-800'
            }`}>
              {selectedSchoolProfile.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {selectedSchoolProfile.boardType} Board Affiliated • Free Olympiad Registration Center
          </p>
        </div>
        <div className="bg-slate-50 border p-3 rounded-xl flex flex-col text-right">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">School ID</span>
          <span className="font-mono text-sm font-bold text-blue-600 mt-0.5">{selectedSchoolProfile.id}</span>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Details list */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Institution Parameters</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Principal Officer:</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5 text-xs">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {selectedSchoolProfile.principalName}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Olympiad Coordinator:</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5 text-xs">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {selectedSchoolProfile.coordinatorName}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Coordinator Contact Mobile:</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5 font-mono text-xs">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {selectedSchoolProfile.mobile}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Coordinator Contact Email:</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5 font-mono text-xs">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {selectedSchoolProfile.email}
              </p>
            </div>

            <div className="sm:col-span-2">
              <span className="text-slate-400 font-medium">Postal Address Location:</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {selectedSchoolProfile.address}, {selectedSchoolProfile.city}, {selectedSchoolProfile.state}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Registered Candidate Cap:</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {selectedSchoolProfile.totalStudents} Candidates (Free Enrolled)
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Registration Timeframe:</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5 text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(selectedSchoolProfile.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="space-y-6 md:col-span-1">
          {/* School Exam Schedule Panel */}
          {selectedSchoolProfile.status === 'APPROVED' && (
            <form onSubmit={handleSaveSchoolExamSchedule} className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b pb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">November Exam Date</h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Set or update the mutually agreed November Olympiad exam date and time for this school.
              </p>

              {schSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl font-semibold text-[11px]">
                  {schSuccess}
                </div>
              )}
              {schError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-xl font-semibold text-[11px]">
                  {schError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Exam Date (November)</label>
                  <input
                    type="date"
                    value={schDate}
                    onChange={(e) => setSchDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg p-2 font-mono font-bold text-slate-800 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Exam Time</label>
                    <input
                      type="text"
                      placeholder="10:00 AM"
                      value={schTime}
                      onChange={(e) => setSchTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg p-2 font-mono text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration (mins)</label>
                    <input
                      type="number"
                      placeholder="120"
                      value={schDuration}
                      onChange={(e) => setSchDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg p-2 font-mono text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={schSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                {schSaving ? 'Saving Date...' : 'Save & Update Schedule'}
              </button>
            </form>
          )}

          {/* Secure Passwords / Credentials Panel */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Administrative Keys</h3>
            
            {selectedSchoolProfile.status === 'APPROVED' ? (
              <div className="space-y-3">
                <div className="bg-slate-50 border p-3 rounded-lg text-xs">
                  <span className="text-slate-400 font-medium">Portal Credentials Status</span>
                  <p className="font-mono font-bold text-emerald-600 mt-0.5">Securely Encrypted</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-[10px] text-blue-800 font-semibold leading-relaxed">
                  Tip: Provide these credentials to coordinator teachers. They can log in to the School Dashboard to register students free of charge.
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-4 text-center">
                Credentials will be generated automatically and sent via email upon approval of this enrollment request.
              </div>
            )}
          </div>

          {/* Merit Qualification Thresholds Panel */}
          {selectedSchoolProfile.status === 'APPROVED' && (
            <form onSubmit={handleSavePassingMarks} className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b pb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Merit Thresholds</h3>
              </div>
              
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Define the minimum score (%) required to earn merit qualification per class level. (Default is 60%)
              </p>

              {passingMarksSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl font-semibold text-[11px] leading-relaxed">
                  {passingMarksSuccess}
                </div>
              )}

              {passingMarksError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-xl font-semibold text-[11px] leading-relaxed">
                  {passingMarksError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                {["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((clsLevel) => (
                  <div key={clsLevel} className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{clsLevel}</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={passingMarksEdit[clsLevel] !== undefined ? passingMarksEdit[clsLevel] : ''}
                        placeholder="60"
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value);
                          setPassingMarksEdit(prev => ({
                            ...prev,
                            [clsLevel]: val as number
                          }));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg p-2 pr-6 font-mono font-bold text-slate-800 outline-none transition"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-bold">%</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={savingPassingMarks}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                {savingPassingMarks ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving Thresholds...
                  </>
                ) : (
                  'Save Thresholds'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Candidate Roster list under this school */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Affiliated Candidates Directory</h3>
            <p className="text-xs text-slate-500 mt-0.5">Lists all students registered under this school.</p>
          </div>
          
          {/* Search and Class Filter Toolbar */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto text-xs">
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search student..."
                value={schoolRosterSearch}
                onChange={(e) => setSchoolRosterSearch(e.target.value)}
                className="w-full bg-slate-50 border p-2 pl-9 rounded-lg"
              />
            </div>
            <Combobox
              options={[{ value: "ALL", label: "All Classes" }, ...["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((c) => ({ value: c, label: c }))] }
              value={schoolRosterClassFilter}
              onChange={(val) => setSchoolRosterClassFilter(val)}
              placeholder="All Classes"
              className="w-40"
            />
          </div>
        </div>

        {(() => {
          const totalSchoolStudents = students.filter(st => st.schoolId === selectedSchoolProfile.id);
          if (totalSchoolStudents.length === 0) {
            return (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-xs">
                No candidates registered under this school yet.
              </div>
            );
          }

          const schoolStudents = totalSchoolStudents.filter(st => {
            const matchesSearch = st.name.toLowerCase().includes(schoolRosterSearch.toLowerCase()) ||
                                  st.id.toLowerCase().includes(schoolRosterSearch.toLowerCase()) ||
                                  st.classLevel.toLowerCase().includes(schoolRosterSearch.toLowerCase());
                                  
            const matchesClass = schoolRosterClassFilter === 'ALL' ||
                                 st.classLevel.toLowerCase() === schoolRosterClassFilter.toLowerCase();
                                 
            return matchesSearch && matchesClass;
          });

          if (schoolStudents.length === 0) {
            return (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-xs">
                No matching candidates found.
              </div>
            );
          }

          return (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 font-bold text-slate-600 border-b uppercase text-[9px] tracking-wider">
                    <th className="p-3">Candidate Name</th>
                    <th className="p-3">Student ID</th>
                    <th className="p-3">Class Level</th>
                    <th className="p-3">Contact Email</th>
                    <th className="p-3">Registration Type</th>
                    <th className="p-3">Exam Score</th>
                    <th className="p-3">Qualification</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {schoolStudents.map((st, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900">{st.name}</td>
                      <td className="p-3 font-mono font-bold text-blue-600">{st.id}</td>
                      <td className="p-3 font-semibold text-slate-600">{st.classLevel.replace(/class\s+/gi, '')}</td>
                      <td className="p-3 font-mono text-slate-500">{st.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          FREE REGISTRATION
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={st.score !== undefined && st.score !== null ? st.score : ''}
                            placeholder="—"
                            className="w-16 border border-slate-200 rounded p-1 text-center font-mono font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none"
                            onBlur={(e) => {
                              const scoreVal = parseInt(e.target.value);
                              if (!isNaN(scoreVal) && scoreVal >= 0 && scoreVal <= 100) {
                                handleUpdateScore(st.id, scoreVal);
                              } else if (e.target.value === '') {
                                handleUpdateScore(st.id, 0);
                              } else {
                                alert("Score must be between 0 and 100");
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                          />
                          <span className="text-[10px] text-slate-400 font-bold">%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          st.qualificationStatus === 'QUALIFIED' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          st.qualificationStatus === 'NOT_QUALIFIED' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {st.qualificationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
