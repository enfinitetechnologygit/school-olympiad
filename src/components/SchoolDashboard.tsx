import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useSchoolData } from './school/hooks/useSchoolData';
import SchoolHeader from './school/components/SchoolHeader';
import SchoolSidebar from './school/components/SchoolSidebar';
import SchoolStatsBar from './school/components/SchoolStatsBar';
import RosterTab from './school/tabs/RosterTab';
import QualifiersTab from './school/tabs/QualifiersTab';
import AnalyticsTab from './school/tabs/AnalyticsTab';
import NoticesTab from './school/tabs/NoticesTab';
import ScheduleTab from './school/tabs/ScheduleTab';
import SchoolProfileTab from './school/tabs/SchoolProfileTab';

interface SchoolDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function SchoolDashboard({ user, onLogout }: SchoolDashboardProps) {
  const schoolData = useSchoolData({ user, onLogout });

  const {
    school,
    students,
    announcements,
    activeTab,
    setActiveTab,
    loading,
    showAddForm,
    setShowAddForm,
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
    newPass,
    setNewPass,
    newMobile,
    setNewMobile,
    newParent,
    setNewParent,
    searchTerm,
    setSearchTerm,
    classFilter,
    setClassFilter,
    fetchSchoolData,
    handleBackdoorRegister,
    handleDownloadRegistry
  } = schoolData;

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
          <button onClick={onLogout} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm w-full font-bold cursor-pointer">Return Home</button>
        </div>
      </div>
    );
  }

  const paidCount = students.filter(s => s.paymentStatus === 'COMPLETED').length;
  const qualifiedCount = students.filter(s => s.qualificationStatus === 'QUALIFIED').length;

  const filteredStudents = students.filter(s => {
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
      <SchoolHeader school={school} onLogout={onLogout} />

      {/* Main split canvas */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* Mobile Navigation Horizontal Bar */}
        <div className="md:hidden flex items-center gap-2 p-2.5 bg-white border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'roster' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Manage Roster
          </button>
          <button
            onClick={() => setActiveTab('qualifiers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'qualifiers' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Qualified Students
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Stats & Analytics
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'notices' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Board Circulars
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'schedule' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Pre-Exam Schedule
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            School Profile
          </button>
        </div>

        {/* Left Drawer Menu */}
        <SchoolSidebar school={school} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic tabs canvas content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Quick count metric blocks */}
          <SchoolStatsBar 
            totalStudents={students.length} 
            qualifiedCount={qualifiedCount} 
            paidCount={paidCount}
            school={school} 
          />

          {/* Tab 1: MANAGE STUDENT ROSTER AND BACKDOOR ENTRY */}
          {activeTab === 'roster' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <RosterTab
                school={school}
                students={students}
                filteredStudents={filteredStudents}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                classFilter={classFilter}
                setClassFilter={setClassFilter}
                handleDownloadRegistry={handleDownloadRegistry}
                showAddForm={showAddForm}
                setShowAddForm={setShowAddForm}
                handleBackdoorRegister={handleBackdoorRegister}
                newName={newName}
                setNewName={setNewName}
                newClass={newClass}
                setNewClass={setNewClass}
                newGender={newGender}
                setNewGender={setNewGender}
                newDob={newDob}
                setNewDob={setNewDob}
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                newMobile={newMobile}
                setNewMobile={setNewMobile}
                newParent={newParent}
                setNewParent={setNewParent}
              />
            </motion.div>
          )}

          {/* Tab 2: QUALIFIED STUDENTS TALLY */}
          {activeTab === 'qualifiers' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <QualifiersTab students={students} />
            </motion.div>
          )}

          {/* Tab 3: ANALYTICS BAR CHART VIEW */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <AnalyticsTab students={students} paidCount={paidCount} />
            </motion.div>
          )}

          {/* Tab 4: NOTICES BOARD */}
          {activeTab === 'notices' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <NoticesTab announcements={announcements} />
            </motion.div>
          )}

          {/* Tab 5: PRE-EXAM SCHEDULE */}
          {activeTab === 'schedule' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <ScheduleTab school={school} />
            </motion.div>
          )}

          {/* Tab 6: SCHOOL PROFILE */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <SchoolProfileTab school={school} fetchSchoolData={fetchSchoolData} />
            </motion.div>
          )}

        </main>
      </div>

    </div>
  );
}
