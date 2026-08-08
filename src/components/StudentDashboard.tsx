import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useStudentData } from './student/hooks/useStudentData';
import StudentHeader from './student/components/StudentHeader';
import StudentSidebar from './student/components/StudentSidebar';
import StudentActiveExam from './student/components/StudentActiveExam';
import OverviewTab from './student/tabs/OverviewTab';
import ExamsTab from './student/tabs/ExamsTab';
import AdmitCardTab from './student/tabs/AdmitCardTab';
import SyllabusTab from './student/tabs/SyllabusTab';
import ProfileTab from './student/tabs/ProfileTab';

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

  // Razorpay handler that can be triggered from ExamsTab payment wall
  const handlePayNow = async () => {
    // Switch to overview tab where the Razorpay button lives,
    // or open Razorpay directly here
    if (!student) return;
    const { Razorpay } = window as any;
    if (!Razorpay) {
      alert('Payment gateway failed to initialize. Please hard-refresh (Ctrl+Shift+R) and try again.');
      return;
    }

    try {
      // 1. Create order on server
      const orderRes = await fetch(`/api/students/${student.id}/create-order`, {
        method: 'POST',
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        alert(orderData.error || 'Failed to create payment order.');
        return;
      }

      // 2. Open Razorpay Checkout widget
      const rzp = new Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Enfinite National Olympiad',
        description: 'ENO 2026 — Olympiad Registration Fee',
        image: '/logo.png',
        prefill: { name: student.name, email: student.email, contact: student.mobile || '' },
        notes: { student_id: student.id },
        theme: { color: '#2563eb' },
        handler: async (response: any) => {
          try {
            // 3. Verify payment signature on backend
            const verifyRes = await fetch(`/api/students/${student.id}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (verifyRes.ok) fetchDashboardData();
          } catch (err) { console.error(err); }
        },
      });
      rzp.open();
    } catch (err: any) {
      alert(err.message);
    }
  };


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
      <div className={isPrinting ? "" : "flex flex-col md:flex-row flex-1 overflow-hidden"}>
        {/* Mobile Navigation Horizontal Bar */}
        {!isPrinting && (
          <div className="md:hidden flex items-center gap-2 p-2.5 bg-white border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => { setActiveTab('overview'); setActiveExam(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
            >
              Dashboard Overview
            </button>
            <button
              onClick={() => { setActiveTab('exams'); setActiveExam(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'exams' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
            >
              Mock Test Desk
            </button>
            <button
              onClick={() => { setActiveTab('admitCard'); setActiveExam(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'admitCard' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
            >
              Stage 1 Hall Ticket
            </button>
            <button
              onClick={() => { setActiveTab('syllabus'); setActiveExam(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'syllabus' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
            >
              Olympiad Syllabus
            </button>
            <button
              onClick={() => { setActiveTab('profile'); setActiveExam(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
            >
              My Profile & Photo
            </button>
          </div>
        )}

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
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <OverviewTab
                student={student}
                classGroup={classGroup}
                announcements={announcements}
                simulatePayment={simulatePayment}
                onPaymentSuccess={fetchDashboardData}
              />
            </motion.div>
          )}

          {/* ONLINE PRACTICE MOCK EXAMS PANEL */}
          {activeTab === 'exams' && !activeExam && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <ExamsTab
                classGroup={classGroup}
                matchedExams={matchedExams}
                attempts={attempts}
                handleStartExam={handleStartExam}
                student={student}
                onPayNow={handlePayNow}
              />
            </motion.div>
          )}

          {/* PRINTABLE ADMIT CARD DESIGN */}
          {activeTab === 'admitCard' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <AdmitCardTab
                student={student}
                schoolInfo={schoolInfo}
                schedule={schedule}
                centers={centers}
                selectedAdmitStage={selectedAdmitStage}
                setSelectedAdmitStage={setSelectedAdmitStage}
                isPrinting={isPrinting}
              />
            </motion.div>
          )}

          {/* OLYMPIAD SYLLABUS PANEL */}
          {activeTab === 'syllabus' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <SyllabusTab
                classGroup={classGroup}
                selectedSyllabusId={selectedSyllabusId}
                setSelectedSyllabusId={setSelectedSyllabusId}
              />
            </motion.div>
          )}

          {/* CANDIDATE PROFILE MANAGEMENT PANEL */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <ProfileTab
                student={student}
                fetchDashboardData={fetchDashboardData}
              />
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}
