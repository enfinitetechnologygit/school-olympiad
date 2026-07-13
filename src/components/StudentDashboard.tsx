import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useStudentData } from './student/hooks/useStudentData';
import StudentHeader from './student/components/StudentHeader';
import StudentSidebar from './student/components/StudentSidebar';
import StudentActiveExam from './student/components/StudentActiveExam';
import OverviewTab from './student/tabs/OverviewTab';
import ExamsTab from './student/tabs/ExamsTab';
import AdmitCardTab from './student/tabs/AdmitCardTab';
import SyllabusTab from './student/tabs/SyllabusTab';

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const studentData = useStudentData({ user, onLogout });

  const {
    student,
    activeTab,
    setActiveTab,
    selectedSyllabusId,
    setSelectedSyllabusId,
    exams,
    attempts,
    announcements,
    centers,
    dbItems,
    schedule,
    schoolInfo,
    selectedAdmitStage,
    setSelectedAdmitStage,
    loading,
    isPrinting,
    activeExam,
    setActiveExam,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectedAnswers,
    examSecondsLeft,
    examSubmitted,
    setExamSubmitted,
    fetchDashboardData,
    handleStartExam,
    handleSelectOption,
    handleSubmitExam,
    mapClassToGroup,
    formatTime,
    simulatePayment
  } = studentData;

  if (loading && !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <Clock className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Accessing student credentials...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl max-w-sm text-center border space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold font-display">Access Unauthorized</h3>
          <p className="text-xs text-slate-500 leading-relaxed">No matching student profile details. Please sign up or authenticate with valid parent credentials first.</p>
          <button onClick={onLogout} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm w-full font-bold cursor-pointer">Return Home</button>
        </div>
      </div>
    );
  }

  const classGroup = mapClassToGroup(student.classLevel);
  const matchedExams = exams.filter(e => e.classGroup === classGroup);

  return (
    <div className={isPrinting ? "bg-white p-0" : "min-h-screen bg-slate-50 flex flex-col font-sans"} id="eno-student-panel">
      {/* Top header info */}
      {!isPrinting && (
        <StudentHeader student={student} onLogout={onLogout} />
      )}

      {/* Main dashboard space */}
      <div className={isPrinting ? "" : "flex flex-1 overflow-hidden"}>
        {/* Left Side menu */}
        {!isPrinting && (
          <StudentSidebar 
            student={student} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            setActiveExam={setActiveExam} 
          />
        )}

        {/* Dynamic content canvas */}
        <main className={isPrinting ? "p-0" : "flex-1 overflow-y-auto p-6 space-y-6"}>
          {/* Active Exam Overlay */}
          {activeExam && (
            <StudentActiveExam
              activeExam={activeExam}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              selectedAnswers={selectedAnswers}
              handleSelectOption={handleSelectOption}
              examSecondsLeft={examSecondsLeft}
              examSubmitted={examSubmitted}
              setExamSubmitted={setExamSubmitted}
              formatTime={formatTime}
              handleSubmitExam={handleSubmitExam}
              setActiveExam={setActiveExam}
              fetchDashboardData={fetchDashboardData}
            />
          )}

          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && !activeExam && (
            <OverviewTab
              student={student}
              classGroup={classGroup}
              announcements={announcements}
              simulatePayment={simulatePayment}
            />
          )}

          {/* ONLINE PRACTICE MOCK EXAMS PANEL */}
          {activeTab === 'exams' && !activeExam && (
            <ExamsTab
              classGroup={classGroup}
              matchedExams={matchedExams}
              attempts={attempts}
              handleStartExam={handleStartExam}
            />
          )}

          {/* PRINTABLE ADMIT CARD DESIGN */}
          {activeTab === 'admitCard' && (
            <AdmitCardTab
              student={student}
              schoolInfo={schoolInfo}
              schedule={schedule}
              centers={centers}
              selectedAdmitStage={selectedAdmitStage}
              setSelectedAdmitStage={setSelectedAdmitStage}
              isPrinting={isPrinting}
            />
          )}

          {/* OLYMPIAD SYLLABUS PANEL */}
          {activeTab === 'syllabus' && (
            <SyllabusTab
              classGroup={classGroup}
              selectedSyllabusId={selectedSyllabusId}
              setSelectedSyllabusId={setSelectedSyllabusId}
            />
          )}

        </main>
      </div>
    </div>
  );
}
