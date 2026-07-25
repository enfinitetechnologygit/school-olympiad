import React from 'react';
import { ShieldAlert, Check, Search, MapPin, User, Mail, Phone, Building } from 'lucide-react';
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

      {/* Master School Registry Table (Stunning Redesign) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              Verified Board Directory
            </div>
            <h3 className="text-xl font-extrabold font-display text-slate-900 mt-2 tracking-tight">Master National School Registry</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Lists all listed, approved, and rejected institutions coordinates in database.</p>
          </div>
          <div className="w-full sm:max-w-xs relative text-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search school name or location..."
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-2.5 pl-10 text-xs font-semibold outline-none transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-150 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-900 text-white font-extrabold uppercase text-[10px] tracking-widest">
                <th className="p-4 pl-6">School Name & Board</th>
                <th className="p-4">Unique ID</th>
                <th className="p-4">Staff Coordinator</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSchools.map((sch, i) => (
                <tr key={i} className="hover:bg-blue-50/20 transition duration-150">
                  {/* Column 1: School Name */}
                  <td className="p-4 pl-6">
                    <button
                      onClick={() => setSelectedSchoolProfile(sch)}
                      className="font-black text-sm text-slate-900 hover:text-blue-600 hover:underline text-left block focus:outline-none cursor-pointer"
                    >
                      {sch.name}
                    </button>
                    <span className="text-[11px] text-slate-400 font-bold block mt-1">
                      {sch.boardType} Affiliated &bull; {sch.address}
                    </span>
                  </td>

                  {/* Column 2: Unique ID */}
                  <td className="p-4">
                    <span className="inline-flex items-center font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-100 text-xs shadow-sm">
                      {sch.id}
                    </span>
                  </td>

                  {/* Column 3: Coordinator */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{sch.coordinatorName}</span>
                    </div>
                  </td>

                  {/* Column 4: Contact */}
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-mono">{sch.mobile}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 max-w-[170px] truncate" title={sch.email}>
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{sch.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 5: Location */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-850">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{sch.city}, {sch.state}</span>
                    </div>
                  </td>

                  {/* Column 6: Status */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider ${
                      sch.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      sch.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sch.status === 'APPROVED' ? 'bg-emerald-500 animate-pulse' : sch.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      {sch.status}
                    </span>
                  </td>

                  {/* Column 7: Actions */}
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedSchoolProfile(sch)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-extrabold px-3.5 py-2 rounded-xl transition text-[11px] cursor-pointer shadow-sm"
                      >
                        Profile
                      </button>
                      {sch.status === 'APPROVED' && (
                        <button
                          onClick={() => handleDeleteSchool(sch.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 font-extrabold px-3.5 py-2 rounded-xl transition text-[11px] cursor-pointer shadow-sm"
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
