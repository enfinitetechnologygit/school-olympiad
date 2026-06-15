import React, { useState, useEffect } from 'react';
import { 
  School as SchoolIcon, 
  Users, 
  Activity, 
  Download, 
  Plus, 
  Award, 
  Bell, 
  LogOut, 
  CheckCircle,
  FileText,
  AlertCircle,
  UserCheck,
  Search,
  BookOpen,
  Volume2,
  Calendar
} from 'lucide-react';
import { School, Student, Announcement } from '../types';

interface SchoolDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function SchoolDashboard({ user, onLogout }: SchoolDashboardProps) {
  const [school, setSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<'roster' | 'qualifiers' | 'analytics' | 'notices' | 'schedule'>('roster');
  const [loading, setLoading] = useState(true);

  // New Student Add State (coordinator backdoor registering for parents)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('Class 9');
  const [newGender, setNewGender] = useState('Male');
  const [newDob, setNewDob] = useState('2011-01-01');
  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('student123');
  const [newMobile, setNewMobile] = useState('');
  const [newParent, setNewParent] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');

  const fetchSchoolData = async () => {
    try {
      setLoading(true);
      // Fetch schools to pinpoint
      const sRes = await fetch('/api/schools');
      const sData = await sRes.json();
      
      const matchedSchool = sData.find((s: School) => s.email.toLowerCase() === user.email.toLowerCase());
      if (matchedSchool) {
        setSchool(matchedSchool);
        
        // Fetch students list
        const stRes = await fetch('/api/students');
        const stData = await stRes.json();
        const schoolStudents = stData.filter((s: Student) => s.schoolId === matchedSchool.id);
        setStudents(schoolStudents);
      }

      // Fetch announcements
      const ancRes = await fetch('/api/announcements');
      const ancData = await ancRes.json();
      setAnnouncements(ancData.filter((a: Announcement) => a.audience === 'ALL' || a.audience === 'SCHOOLS'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolData();
  }, [user]);

  const handleBackdoorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          classLevel: newClass,
          gender: newGender,
          dob: newDob,
          mobile: newMobile,
          parentName: newParent,
          parentMobile: newMobile,
          email: newEmail,
          password: newPass,
          schoolId: school.id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Register failed");
      }

      alert(`Candidate registered successfully back-of-office! Automated Student ID: ${data.student.id}`);
      setShowAddForm(false);
      setNewName('');
      setNewEmail('');
      setNewMobile('');
      setNewParent('');
      fetchSchoolData();
    } catch (err: any) {
      alert("Registration error: " + err.message);
    }
  };

  // Download registry simulation
  const handleDownloadRegistry = () => {
    if (!school || students.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(students, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${school.name.replace(/\s+/g, '_')}_StudentRoster_2026.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading && !school) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <Activity className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Retrieving school records...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl max-w-sm text-center border space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold font-display">School Not Located</h3>
          <p className="text-sm text-slate-500">Ensure your coordinator email holds a valid active approval authorization record in administrative dashboards.</p>
          <button onClick={onLogout} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm w-full font-bold">Return Home</button>
        </div>
      </div>
    );
  }

  const paidCount = students.filter(s => s.paymentStatus === 'COMPLETED').length;
  const qualifiedCount = students.filter(s => s.qualificationStatus === 'QUALIFIED').length;

  const filteredStudentsRef = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.classLevel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'ALL' || s.classLevel.toLowerCase() === classFilter.toLowerCase();
    return matchesSearch && matchesClass;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="eno-school-panel">
      
      {/* Top action header bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl flex items-center justify-center shadow">
            <SchoolIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-white">{school.name}</h2>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">BOARD APPROVED SCHOOL COORD PANEL • ID: {school.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
            Status: Approved
          </span>
          <button 
            id="btn-school-logout"
            onClick={onLogout} 
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 px-3 py-1.5 text-white font-bold text-xs rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main split canvas */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Drawer Menu */}
        <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-4 shrink-0 justify-between">
          <div className="space-y-1">
            <div className="p-3 mb-4 bg-slate-50 border border-slate-100 rounded-xl font-display">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Principal Officer</span>
              <p className="text-xs font-bold text-slate-900 mt-1">{school.principalName}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Board: {school.boardType} Affiliated</p>
            </div>

            <button
              onClick={() => setActiveTab('roster')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'roster' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              Manage Roster
            </button>

            <button
              onClick={() => setActiveTab('qualifiers')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'qualifiers' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4.5 h-4.5" />
              Qualified Students
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'analytics' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4.5 h-4.5" />
              Performance Stats
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'notices' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4.5 h-4.5" />
              Board Circulars
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'schedule' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4.5 h-4.5" />
              Pre-Exam Schedule
            </button>
          </div>

          <div className="bg-blue-50/75 border border-blue-100 p-3.5 rounded-xl text-xs text-blue-900 leading-relaxed">
            <h5 className="font-bold flex items-center gap-1 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              Coordinator:
            </h5>
            <p className="font-semibold text-slate-800">{school.coordinatorName}</p>
            <p className="text-[10px] text-slate-500 mt-1">Direct Helpline: {school.mobile}</p>
          </div>
        </aside>

        {/* Dynamic tabs canvas content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Quick count metric blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Registers</span>
                <p className="text-2xl font-black font-display text-slate-900 mt-1">{students.length}</p>
              </div>
              <div className="bg-blue-50 p-3 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Stage 2 Qualified</span>
                <p className="text-2xl font-black font-display text-indigo-600 mt-1">{qualifiedCount}</p>
              </div>
              <div className="bg-indigo-50 p-3 text-indigo-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">School Location</span>
                <p className="text-sm font-extrabold font-display text-slate-900 mt-1 leading-tight">{school.city}, {school.state}</p>
              </div>
              <div className="bg-slate-50 p-3 text-slate-500 rounded-xl">
                <SchoolIcon className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Tab 1: MANAGE STUDENT ROSTER AND BACKDOOR ENTRY */}
          {activeTab === 'roster' && (
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
                    className="px-4 py-2 bg-white hover:bg-slate-50 border text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    Download JSON Registry
                  </button>

                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    id="btn-add-student-backdoor"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-1.5 border text-xs rounded-lg">Cancel</button>
                    <button type="submit" className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg">Create Registration</button>
                  </div>
                </form>
              )}

              {/* Students listing grid */}
              <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                {filteredStudentsRef.length === 0 ? (
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
                      {filteredStudentsRef.map((st, idx) => (
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
          )}

          {/* Tab 2: QUALIFIED STUDENTS TALLY */}
          {activeTab === 'qualifiers' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-950">Mains Stage 2 Qualified Scholar Pool</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Students listed here have achieved a high-scale practice/pre-exam mock score at or above <strong>60%</strong> and are authorized for Mains Stage 2 final.
                </p>
              </div>

              {students.filter(s => s.qualificationStatus === 'QUALIFIED').length === 0 ? (
                <div className="p-8 bg-white text-center rounded-xl border border-dashed space-y-2">
                  <Award className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-500">Currently no students under this campus coordinates hit the Stage 2 criteria threshold.</p>
                </div>
              ) : (
                <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b uppercase text-[9px] tracking-wider">
                        <th className="p-4">Qualifying Candidate</th>
                        <th className="p-4">Olympiad Roll ID</th>
                        <th className="p-4">Highest Registered Score</th>
                        <th className="p-4">Allotted Mains Center Network</th>
                        <th className="p-4">Admit Token</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium">
                      {students.filter(s => s.qualificationStatus === 'QUALIFIED').map((st, i) => (
                        <tr key={i} className="hover:bg-slate-50/40">
                          <td className="p-4">
                            <p className="font-extrabold text-slate-900">{st.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono italic">{st.classLevel}</p>
                          </td>
                          <td className="p-4 font-mono text-blue-600 font-bold">{st.id}</td>
                          <td className="p-4 font-mono font-bold text-emerald-600">{st.score}% Achieve</td>
                          <td className="p-4 text-slate-700">
                            <strong>{st.schoolName.includes('Kolkata') ? "Salt Lake InfoTech Center" :
                                     st.schoolName.includes('Pune') ? "Hinjewadi Tech Labs" :
                                     st.schoolName.includes('Bengaluru') ? "Silicon Valley Institute" :
                                     "National Tech Center, New Delhi"}</strong>
                          </td>
                          <td className="p-4 font-mono font-semibold text-slate-500">{st.admitCardNumber || "Pending"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

          {/* Tab 3: ANALYTICS BAR CHART VIEW (CUSTOM SVG) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-6">
                <div>
                  <h4 className="text-base font-bold font-display text-slate-950">Campus Enrollment Distribution Analytics</h4>
                  <p className="text-xs text-slate-500 mt-1">Visualizing pupil registration parameters divided by division blocks.</p>
                </div>

                {/* Custom Responsive SVG Chart */}
                <div className="w-full bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs pb-4 border-b">
                    <span className="font-bold text-slate-700">Class Block Demographics</span>
                    <span className="text-[11px] text-slate-400">Total verified sample: {students.length} pupils</span>
                  </div>

                  <div className="mt-6 flex flex-col gap-4">
                    {["Class 5-6", "Class 7-8", "Class 9-10", "Class 11-12"].map((grp, gIdx) => {
                      // Calculate counts
                      const totalGrpStudents = students.filter(s => {
                        if (grp === "Class 5-6") return s.classLevel.includes('5') || s.classLevel.includes('6');
                        if (grp === "Class 7-8") return s.classLevel.includes('7') || s.classLevel.includes('8');
                        if (grp === "Class 9-10") return s.classLevel.includes('9') || s.classLevel.includes('10');
                        return s.classLevel.includes('11') || s.classLevel.includes('12');
                      }).length;

                      const percentage = students.length > 0 ? (totalGrpStudents / students.length) * 100 : 0;

                      return (
                        <div key={gIdx} className="space-y-1.5">
                          <div className="flex justify-between text-xs text-slate-700 font-semibold">
                            <span>{grp} Division</span>
                            <span>{totalGrpStudents} candidates ({Math.round(percentage)}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage || 5}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-dashed text-center text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">FINANCIAL CLEARED PROPORTION</p>
                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {students.length > 0 ? Math.round((paidCount / students.length) * 100) : 0}% Registered Checkout
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">AVERAGE PRACTICE GRADE</p>
                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {students.some(s => s.score !== undefined) 
                          ? `${Math.round(students.reduce((acc, cr) => acc + (cr.score || 0), 0) / students.filter(s => s.score !== undefined).length)}% Average`
                          : "No Attempts Yet"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Tab 4: NOTICES BOARD */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              
              <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-600 animate-pulse" />
                    Administrative Notices & Regional Circulars
                  </h4>
                </div>

                <div className="space-y-4">
                  {announcements.length === 0 ? (
                    <p className="text-xs text-slate-500">No active notices logged.</p>
                  ) : (
                    announcements.map((anc, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded">
                            POSTED BY: {anc.postedBy}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {new Date(anc.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 font-display text-sm">{anc.title}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed font-light">{anc.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Tab 5: PRE-EXAM SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fade-in">
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

                {school && (
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
                            <span className="font-bold text-slate-900">{school.preExamDate}</span>
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
                )}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
