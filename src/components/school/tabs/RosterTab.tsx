import React from 'react';
import { Search, Download, Plus, Users } from 'lucide-react';
import { School, Student } from '../../../types';

interface RosterTabProps {
  school: School;
  students: Student[];
  filteredStudents: Student[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  classFilter: string;
  setClassFilter: (val: string) => void;
  handleDownloadRegistry: () => void;
  showAddForm: boolean;
  setShowAddForm: (val: boolean) => void;
  handleBackdoorRegister: (e: React.FormEvent) => void;
  
  // Registration form values & setters
  newName: string;
  setNewName: (val: string) => void;
  newClass: string;
  setNewClass: (val: string) => void;
  newGender: string;
  setNewGender: (val: string) => void;
  newDob: string;
  setNewDob: (val: string) => void;
  newEmail: string;
  setNewEmail: (val: string) => void;
  newMobile: string;
  setNewMobile: (val: string) => void;
  newParent: string;
  setNewParent: (val: string) => void;
}

export default function RosterTab({
  school,
  students,
  filteredStudents,
  searchTerm,
  setSearchTerm,
  classFilter,
  setClassFilter,
  handleDownloadRegistry,
  showAddForm,
  setShowAddForm,
  handleBackdoorRegister,
  newName,
  setNewName,
  newClass,
  setNewClass,
  newGender,
  setNewGender,
  newDob,
  setNewDob,
  newEmail,
  setNewEmail,
  newMobile,
  setNewMobile,
  newParent,
  setNewParent
}: RosterTabProps) {
  return (
    <div className="space-y-6">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter standard, roll, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl p-2.5 pl-10 text-xs text-slate-800 focus:bg-white outline-none"
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-white border border-slate-200 focus:border-blue-500 rounded-xl p-2.5 text-xs text-slate-850 outline-none font-semibold cursor-pointer"
          >
            <option value="ALL">All Classes</option>
            {["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadRegistry}
            id="btn-download-roster"
            className="px-4 py-2 bg-white hover:bg-slate-50 border text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Download JSON Registry
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            id="btn-add-student-backdoor"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer animate-fade-in"
          >
            <Plus className="w-4 h-4" />
            Office Registration Entry
          </button>
        </div>
      </div>

      {/* Add Student Form overlay block */}
      {showAddForm && (
        <form onSubmit={handleBackdoorRegister} className="bg-white border border-blue-100 rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-bold font-display text-blue-950">Add Student (Direct School Register Authorization)</h4>
          <p className="text-[11px] text-slate-500">Links candidate automatically under approved campus parameters without requiring individual verification steps.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold block">Candidate Full Name</label>
              <input 
                type="text" required placeholder="e.g. Ramesh Chandra"
                value={newName} onChange={(e) => setNewName(e.target.value)}
                className="w-full mt-1 border rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold block">Class Level (5-12)</label>
              <select 
                value={newClass} onChange={(e) => setNewClass(e.target.value)}
                className="w-full mt-1 border rounded-lg p-2 text-xs"
              >
                {["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((cl, i) => (
                  <option key={i} value={cl}>{cl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold block">Gender</label>
              <select 
                value={newGender} onChange={(e) => setNewGender(e.target.value)}
                className="w-full mt-1 border rounded-lg p-2 text-xs"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold block">Candidate DOB</label>
              <input 
                type="date" required
                value={newDob} onChange={(e) => setNewDob(e.target.value)}
                className="w-full mt-1 border rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold block">Login Email Address</label>
              <input 
                type="email" required placeholder="e.g. ramesh@example.com"
                value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                className="w-full mt-1 border rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold block">Contact Mobile Number</label>
              <input 
                type="tel" required placeholder="Contact Mobile"
                value={newMobile} onChange={(e) => setNewMobile(e.target.value)}
                className="w-full mt-1 border rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold block">Parent/Guardian Name</label>
              <input 
                type="text" required placeholder="Father or Mother name"
                value={newParent} onChange={(e) => setNewParent(e.target.value)}
                className="w-full mt-1 border rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-1.5 border text-xs rounded-lg cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer">Create Registration</button>
          </div>
        </form>
      )}

      {/* Students listing grid */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        {filteredStudents.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">No matching student registrations inside your campus link.</p>
          </div>
        ) : (
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b uppercase text-[9px] tracking-wider">
                <th className="p-4">Enrollment Candidate Detail</th>
                <th className="p-4">Class Standard</th>
                <th className="p-4">DOB</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Parent/Guardian</th>
                <th className="p-4">Admit Serial</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.map((st, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="p-4">
                    <p className="font-extrabold text-slate-900">{st.name}</p>
                    <p className="text-[10px] font-mono text-blue-600 font-bold mt-0.5">{st.id}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{st.classLevel}</td>
                  <td className="p-4 font-mono font-medium text-slate-700">{st.dob || "—"}</td>
                  <td className="p-4">
                    <p className="text-[11px] text-slate-600 font-light">{st.email}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Mob: {st.mobile || "—"}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{st.parentName || "—"}</td>
                  <td className="p-4 font-mono font-bold text-slate-500">{st.admitCardNumber || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
