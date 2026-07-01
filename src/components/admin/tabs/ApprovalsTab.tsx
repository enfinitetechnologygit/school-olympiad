import React from 'react';
import { ShieldAlert, Check, Search } from 'lucide-react';
import { School } from '../../../types';

interface ApprovalsTabProps {
  schools: School[];
  schoolSearch: string;
  setSchoolSearch: (val: string) => void;
  handleApproveSchool: (schoolId: string) => void;
  handleRejectSchool: (schoolId: string) => void;
  handleDeleteSchool: (schoolId: string) => void;
  setSelectedSchoolProfile: (school: School | null) => void;
}

export default function ApprovalsTab({
  schools,
  schoolSearch,
  setSchoolSearch,
  handleApproveSchool,
  handleRejectSchool,
  handleDeleteSchool,
  setSelectedSchoolProfile
}: ApprovalsTabProps) {
  const pendingRequests = schools.filter(s => s.status === 'PENDING');

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) || 
    s.city.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold font-display text-slate-950 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
          Pending School Enrollment Requests ({pendingRequests.length})
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Coordinator teachers submit school parameters. Verify board parameters below to approve unique School IDs and active checkout logins.
        </p>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-500 text-xs">
            ✓ All campus registration submissions are completely reviewed. No outstanding pending entries.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req, idx) => (
              <div key={idx} className="p-5 bg-slate-50 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded uppercase">{req.boardType} Board</span>
                    <span className="text-xs font-mono font-medium text-slate-400">Request: {req.id}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mt-1 text-sm sm:text-base font-display">{req.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">Location: <strong>{req.city}, {req.state}</strong> • Submitter: {req.coordinatorName} ({req.email})</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">Date Submitted: {new Date(req.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
                  <button
                    onClick={() => handleRejectSchool(req.id)}
                    className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border text-slate-700 font-bold text-xs rounded-lg transition"
                  >
                    Deny Authorize
                  </button>
                  <button
                    onClick={() => handleApproveSchool(req.id)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1 transition"
                  >
                    <Check className="w-4.5 h-4.5" />
                    Approve & Issue ID
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Master School Directory list */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold font-display text-slate-950">Master National School Registry</h3>
            <p className="text-xs text-slate-500 mt-0.5">Lists all listed, approved, and rejected institutions coordinates in database.</p>
          </div>
          <div className="w-full sm:max-w-xs relative text-xs">
            <Search className="absolute left-2.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search school name or location..."
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
              className="w-full bg-slate-50 border p-2 pl-9 rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 font-bold text-slate-600 border-b uppercase text-[9px] tracking-wider">
                <th className="p-3">School Name Coordinates</th>
                <th className="p-3">Unique ID / Pass</th>
                <th className="p-3">Staff Coordinator</th>
                <th className="p-3">Contact</th>
                <th className="p-3">State Province</th>
                <th className="p-3">Verification ID State</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {filteredSchools.map((sch, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedSchoolProfile(sch)}
                      className="font-extrabold text-slate-900 hover:text-blue-600 hover:underline text-left block focus:outline-none cursor-pointer"
                    >
                      {sch.name}
                    </button>
                    <span className="text-[10px] text-slate-400 font-semibold">{sch.boardType} Board • {sch.address}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono font-bold text-blue-600">{sch.id}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Password: {sch.password || '—'}</span>
                  </td>
                  <td className="p-3">{sch.coordinatorName}</td>
                  <td className="p-3">
                    <span className="font-mono block font-semibold">{sch.mobile}</span>
                    <span className="text-slate-400 block text-[10px] truncate max-w-[150px]">{sch.email}</span>
                  </td>
                  <td className="p-3">{sch.city}, {sch.state}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      sch.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      sch.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sch.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedSchoolProfile(sch)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-extrabold px-2 py-1 rounded transition text-[10px] cursor-pointer"
                      >
                        Profile
                      </button>
                      {sch.status === 'APPROVED' && (
                        <button
                          onClick={() => handleDeleteSchool(sch.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-extrabold px-2 py-1 rounded transition text-[10px] cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
