import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  Award, 
  FileText, 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Download, 
  Calendar, 
  Volume2, 
  LogOut, 
  Menu,
  ChevronRight,
  Printer,
  Sparkles,
  Trophy,
  History,
  Info
} from 'lucide-react';
import { Student, School, MockExam, StudentExamAttempt, Announcement, OLYMPIAD_SYLLABUS, ExamCenter, DBItem, ExamSchedule } from '../types';

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'history' | 'admitCard' | 'syllabus' | 'items'>('overview');
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string>('5-6');
  const [exams, setExams] = useState<MockExam[]>([]);
  const [attempts, setAttempts] = useState<StudentExamAttempt[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [centers, setCenters] = useState<ExamCenter[]>([]);
  const [dbItems, setDbItems] = useState<DBItem[]>([]);
  const [schedule, setSchedule] = useState<ExamSchedule | null>(null);
  const [schoolInfo, setSchoolInfo] = useState<School | null>(null);
  const [selectedAdmitStage, setSelectedAdmitStage] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Active Exam State
  const [activeExam, setActiveExam] = useState<MockExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examSecondsLeft, setExamSecondsLeft] = useState(0);
  const [examIntervalId, setExamIntervalId] = useState<any>(null);
  const [examSubmitted, setExamSubmitted] = useState<any | null>(null);



  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch students list to pinpoint logged-in profile
      const stRes = await fetch('/api/students');
      const stData = await stRes.json();
      const matchedStudent = stData.find((s: Student) => s.email.toLowerCase() === user.email.toLowerCase());
      if (matchedStudent) {
        setStudent(matchedStudent);
        setSelectedSyllabusId(mapClassToGroup(matchedStudent.classLevel));
        
        try {
          const schRes = await fetch(`/api/schools/${matchedStudent.schoolId}`);
          if (schRes.ok) {
            const schData = await schRes.json();
            setSchoolInfo(schData);
          }
        } catch (err) {
          console.error("Error fetching school details for student:", err);
        }
      }

      // Fetch exams List
      const exRes = await fetch('/api/exams');
      const exData = await exRes.json();
      setExams(exData);

      // Fetch attempts
      const attRes = await fetch('/api/attempts');
      const attData = await attRes.json();
      if (matchedStudent) {
        const filteredAttempts = attData.filter((a: StudentExamAttempt) => a.studentId === matchedStudent.id);
        setAttempts(filteredAttempts);
      }

      // Fetch announcements
      const ancRes = await fetch('/api/announcements');
      const ancData = await ancRes.json();
      setAnnouncements(ancData.filter((a: Announcement) => a.audience === 'ALL' || a.audience === 'STUDENTS'));

      // Fetch centers list
      const cenRes = await fetch('/api/centers');
      const cenData = await cenRes.json();
      setCenters(cenData);

      // Fetch items from new PostgreSQL database endpoint
      try {
        const itemsRes = await fetch('/api/db/items');
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setDbItems(itemsData);
        }
      } catch (err) {
        console.error("Error fetching database items:", err);
      }

      // Fetch exam schedule
      try {
        const schRes = await fetch('/api/exam-schedule');
        if (schRes.ok) {
          const schData = await schRes.json();
          setSchedule(schData);
        }
      } catch (err) {
        console.error("Error fetching exam schedule:", err);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Manage countdown timer ticking during active exams
  useEffect(() => {
    let interval: any = null;
    if (activeExam && examSecondsLeft > 0 && !examSubmitted) {
      interval = setInterval(() => {
        setExamSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setExamIntervalId(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeExam, examSecondsLeft, examSubmitted]);

  const handleStartExam = (exam: MockExam) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamSecondsLeft(exam.durationMinutes * 60);
    setExamSubmitted(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleAutoSubmitExam = () => {
    handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    if (!activeExam || !student) return;

    // Check force submit alert or fetch result backend
    setLoading(true);
    if (examIntervalId) clearInterval(examIntervalId);

    try {
      const response = await fetch(`/api/exams/${activeExam.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          answers: selectedAnswers,
          timeSpentSeconds: activeExam.durationMinutes * 60 - examSecondsLeft
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setExamSubmitted(data);
      // Refresh score metric on dashboard
      fetchDashboardData();
    } catch (err) {
      alert("Error grading test. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const mapClassToGroup = (cl: string): string => {
    if (cl.includes('5') || cl.includes('6')) return '5-6';
    if (cl.includes('7') || cl.includes('8')) return '7-8';
    if (cl.includes('9') || cl.includes('10')) return '9-10';
    return '11-12';
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
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
          <button onClick={onLogout} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm w-full font-bold">Return Home</button>
        </div>
      </div>
    );
  }

  const classGroup = mapClassToGroup(student.classLevel);
  // Match exams of this student class Group
  const matchedExams = exams.filter(e => e.classGroup === classGroup);

  return (
    <div className={isPrinting ? "bg-white p-0" : "min-h-screen bg-slate-50 flex flex-col font-sans"} id="eno-student-panel">
      
      {/* Top dashboard header info */}
      {!isPrinting && (
        <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">STUDENT PORTAL CHANNEL</h2>
              <p className="text-[10px] text-slate-400 font-mono">Welcome back, {student.name} ({student.id})</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
              Current Stage: <strong className="text-white">Stage 1 Pre-Exam ({student.schoolName})</strong>
            </span>
            <button 
              id="btn-student-logout"
              onClick={onLogout} 
              className="flex items-center gap-1 bg-red-600 hover:bg-red-500 px-3 py-1.5 text-white font-bold text-xs rounded-lg transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </header>
      )}

      {/* Main dashboard space */}
      <div className={isPrinting ? "" : "flex flex-1 overflow-hidden"}>
        
        {/* Left Side menu */}
        {!isPrinting && (
          <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-4 shrink-0 justify-between no-print">
          <div className="space-y-1">
            <div className="p-3 mb-4 bg-blue-50 text-blue-900 rounded-xl">
              <span className="text-[9px] uppercase font-bold tracking-widest text-blue-600">National Council</span>
              <p className="text-xs font-bold font-display mt-0.5 leading-tight">{student.schoolName}</p>
              <p className="text-[9px] text-slate-500 font-mono mt-1 font-semibold uppercase">{student.classLevel} division</p>
            </div>

            <button
              onClick={() => { setActiveTab('overview'); setActiveExam(null); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4.5 h-4.5" />
              Portal Overview
            </button>

            <button
              onClick={() => { setActiveTab('exams'); setActiveExam(null); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'exams' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4.5 h-4.5" />
              Practice Mock Exams
            </button>



            <button
              onClick={() => { setActiveTab('admitCard'); setActiveExam(null); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'admitCard' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4.5 h-4.5" />
              Print Admit Card
            </button>

            <button
              onClick={() => { setActiveTab('syllabus'); setActiveExam(null); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'syllabus' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              Olympiad Syllabus
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Pre-Exam Registration</span>
              <p className="text-xs font-extrabold text-slate-700 mt-1 leading-none uppercase">{student.paymentStatus}</p>
            </div>
          </div>
        </aside>
      )}

        {/* Dynamic content canvas */}
        <main className={isPrinting ? "p-0" : "flex-1 overflow-y-auto p-6 space-y-6"}>
          
          {/* Active Exam Interface Mode Overlay */}
          {activeExam && (
            <div className="bg-white border rounded-xl overflow-hidden shadow-lg p-6 space-y-6">
              
              {/* Exam Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-950">{activeExam.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                    Class Group Block: {activeExam.classGroup} • Computer Science Logic
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-red-50 text-red-800 border border-red-100 px-4 py-2 rounded-xl">
                  <Clock className="w-5 h-5 text-red-600 animate-pulse" />
                  <div>
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider leading-none">Time Remaining</p>
                    <p className="text-lg font-mono font-black mt-1">{formatTime(examSecondsLeft)}</p>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="bg-slate-50 p-2.5 rounded-xl border flex items-center justify-between text-xs text-slate-600">
                <span>Attempting question <strong>{currentQuestionIndex + 1}</strong> of <strong>{activeExam.totalQuestions}</strong></span>
                <span className="text-blue-600 font-bold">Grading mode: Automatic scoring</span>
              </div>

              {!examSubmitted ? (
                <>
                  {/* Current Question panel */}
                  <div className="space-y-4">
                    <h4 className="text-base sm:text-lg font-bold font-display text-slate-900 leading-snug">
                      Q{currentQuestionIndex + 1}. {activeExam.questions[currentQuestionIndex].question}
                    </h4>

                    {/* MCQs */}
                    <div className="space-y-2.5">
                      {activeExam.questions[currentQuestionIndex].options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[activeExam.questions[currentQuestionIndex].id] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectOption(activeExam.questions[currentQuestionIndex].id, oIdx)}
                            className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition active:scale-99 cursor-pointer flex items-center gap-3 ${
                              isSelected 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border-slate-300'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nav button row */}
                  <div className="flex mt-6 justify-between items-center pt-4 border-t">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-30"
                    >
                      Previous Question
                    </button>

                    <div className="flex gap-2">
                      {currentQuestionIndex < activeExam.totalQuestions - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmitExam}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-extrabold shadow"
                        >
                          Submit Practice Answers
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Results card overlay */
                <div className="p-6 bg-blue-50/50 border border-blue-200 rounded-xl space-y-6 text-center">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-display text-blue-950">Mock Test Submitted Successfully!</h3>
                    <p className="text-xs text-slate-500 mt-1">Real-time grading completed synchronously across regional standards.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="p-3 bg-white rounded-lg border border-slate-100 font-display">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">SCORE ACHIEVED</p>
                      <p className="text-3xl font-extrabold text-blue-600 mt-1">{examSubmitted.score}%</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-100 font-display">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">CORRECT</p>
                      <p className="text-3xl font-extrabold text-slate-700 mt-1">{examSubmitted.correctCount} / {examSubmitted.totalCount}</p>
                    </div>
                  </div>



                  <button
                    type="button"
                    onClick={() => { setActiveExam(null); setExamSubmitted(null); fetchDashboardData(); }}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs"
                  >
                    Return to Student Dashboard
                  </button>
                </div>
              )}

            </div>
          )}

          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && !activeExam && (
            <div className="space-y-6">
              
              {/* Profile welcome summary widgets */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md shadow-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider text-blue-200">
                      STUDENT DETAILS RUNDOWN
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display mt-2">{student.name}</h2>
                    <p className="text-xs text-blue-100 font-light mt-1">Registered under: <strong>{student.schoolName}</strong> • {student.classLevel}</p>
                  </div>

                  {student.paymentStatus !== "COMPLETED" ? (
                    <div className="p-3 bg-red-500/25 border border-red-500/10 rounded-xl space-y-2 max-w-sm">
                      <p className="text-xs text-white">Payment of ₹200 pending. Complete payment to obtain your National Admit Card details.</p>
                      <button 
                        onClick={async () => {
                          const res = await fetch(`/api/students/${student.id}/pay`, { method: 'POST' });
                          if (res.ok) {
                            alert("Payment Successful! Mock Razorpay gateway synchronized.");
                            fetchDashboardData();
                          }
                        }}
                        className="w-full py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-lg text-xs"
                      >
                        Simulate Payment (₹200)
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-xs space-y-1">
                      <p className="font-semibold text-emerald-300">✓ SECURE REGISTRATION COMPLETED</p>
                      <p className="text-slate-300">Receipt Ref: <span className="font-mono text-[10px] text-white">{student.paymentId}</span></p>
                      <span className="inline-block mt-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-extrabold uppercase">
                        ADMIT CARD LOCKED
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid overview stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="bg-white border rounded-2xl p-5 relative flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Exam Enrollment ID</span>
                    <p className="text-xl font-bold font-display text-slate-900 mt-1 font-mono text-blue-600">{student.id}</p>
                  </div>
                  <div className="border-t pt-3 mt-4 text-[11px] text-slate-500 flex justify-between items-center">
                    <span>Olympiad Record ID</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-bold">2026 Season</span>
                  </div>
                </div>

                <div className="bg-white border rounded-2xl p-5 relative flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Highest Mock Score</span>
                    <p className="text-xl font-bold font-display text-slate-900 mt-1">
                      {student.score !== undefined ? `${student.score}%` : "Not Attempted"}
                    </p>
                  </div>
                  <div className="border-t pt-3 mt-4 text-[11px] text-slate-500 flex justify-between items-center">
                    <span>Group Block: Class {classGroup}</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-bold">Info</span>
                  </div>
                </div>

              </div>

              {/* Main content split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left col: announcements */}
                <div className="col-span-1 lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    Latest Board Announcements
                  </h3>
                  <div className="space-y-3">
                    {announcements.length === 0 ? (
                      <p className="text-xs text-slate-500">No active board broadcasts in memory details.</p>
                    ) : (
                      announcements.map((anc, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                              {anc.postedBy}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(anc.date).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-display leading-snug">{anc.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-light">{anc.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right col: exam guidelines */}
                <div className="col-span-1 lg:col-span-5 space-y-6">
                  
                  {/* Exam Venue & Practice Guidelines snippet */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Exam & Practice Guidelines
                    </h3>
                    <div className="space-y-4 text-xs">
                      <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                        <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          Mock Exams (Practice)
                        </h4>
                        <p className="text-slate-600 mt-1 leading-relaxed">
                          Mock exams are strictly online and for practice purposes. They help you get familiar with the test structure and format, and do not impact your official qualification or scoring.
                        </p>
                      </div>
                      <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <h4 className="font-extrabold text-indigo-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          Stage 1 Pre-Exam (Official)
                        </h4>
                        <p className="text-slate-600 mt-1 leading-relaxed">
                          The official Pre-Exam is a written test held **offline at your enrolled school campus**. Please print your Stage 1 Admit Card and consult your school coordinator for schedule and seating details.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ONLINE PRACTICE MOCK EXAMS PANEL */}
          {activeTab === 'exams' && !activeExam && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-950">Practice Mock Exams (Online Practice Only)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  These online mock exams are strictly for self-practice and logic training corresponding to class Group <strong>{classGroup}</strong>.
                  They do **not** carry official scoring weight or affect your qualification status.
                  The official **Stage 1 Pre-Exam** will be conducted offline at your school campus.
                </p>
              </div>

              {matchedExams.length === 0 ? (
                <div className="p-8 bg-white text-center rounded-xl border border-dashed space-y-3">
                  <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-500">No Mock Exams scheduled currently for your group tier.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchedExams.map((exam, idx) => (
                    <div key={idx} className="bg-white border rounded-2xl p-5 flex flex-col justify-between shadow-sm relative">
                      <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        {exam.durationMinutes} Minutes
                      </span>

                      <div>
                        <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
                        <h4 className="font-bold text-slate-950 font-display text-base leading-tight">{exam.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">This practice test contains <strong>{exam.totalQuestions} multiple-choice questions</strong> based on standardized testing benchmarks.</p>
                      </div>

                      {(() => {
                        const examAttempts = attempts.filter(att => att.examId === exam.id);
                        if (examAttempts.length > 0) {
                          const highestScoreAttempt = [...examAttempts].sort((a, b) => b.score - a.score)[0];
                          const latestAttempt = [...examAttempts].sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())[0];
                          return (
                            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Practice Attempts</span>
                                <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded font-black font-mono">
                                  {examAttempts.length} Total
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-slate-700 mt-1">
                                <div className="p-2 bg-white rounded border border-slate-150">
                                  <p className="text-[9px] text-slate-400 font-bold uppercase">Highest Score</p>
                                  <p className="text-sm font-extrabold text-blue-600 mt-0.5">{highestScoreAttempt.score}%</p>
                                </div>
                                <div className="p-2 bg-white rounded border border-slate-150">
                                  <p className="text-[9px] text-slate-400 font-bold uppercase">Latest Score</p>
                                  <p className="text-sm font-extrabold text-slate-700 mt-0.5">{latestAttempt.score}%</p>
                                </div>
                              </div>
                              <p className="text-[9px] text-slate-400 font-mono">
                                Last attempted: {new Date(latestAttempt.attemptedAt).toLocaleDateString()}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <div className="mt-6 pt-4 border-t flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-mono">Practice Mode (Unlimited Attempts)</span>
                        <button
                          onClick={() => handleStartExam(exam)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition active:scale-98"
                        >
                          Launch Practice Test
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}



          {/* PRINTABLE ADMIT CARD DESIGN */}
          {activeTab === 'admitCard' && (
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
                    <div className="text-center pb-4 border-b-2 border-dashed space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Government Affiliated Testing Scheme</span>
                      <h3 className="text-base sm:text-lg font-extrabold font-display uppercase tracking-widest text-slate-950">
                        ENFINITE NATIONAL COMPUTER SCIENCE OLYMPIAD BOARD
                      </h3>
                      <div className="inline-block px-3 py-0.5 bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[10px] rounded uppercase mt-1 tracking-wider">
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
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Admit Roll Number</span>
                          <p className="font-mono font-black text-blue-600 text-sm">{student.stage1AdmitNumber || "ENO-S1-NOTGEN"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Olympiad Class Standard</span>
                          <p className="font-bold text-slate-900">{student.classLevel} Division</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Enrollment Identifier</span>
                          <p className="font-mono text-slate-700 font-semibold">{student.id}</p>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-200" />

                    {/* Date, Timing, allocated Center */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 p-4 rounded-lg bg-slate-50 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Scheduled Date</span>
                        <p className="font-black text-slate-950 mt-0.5">{schoolInfo?.preExamDate}</p>
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
                        <p className="font-display font-semibold text-slate-950 text-xs italic tracking-wider mt-1 block">Dr. Sandeep Singh</p>
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
                    <div className="text-center pb-4 border-b-2 border-dashed space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Official Government Affiliated Level-2 Scheme</span>
                      <h3 className="text-base sm:text-lg font-extrabold font-display uppercase tracking-widest text-slate-950">
                        ENFINITE NATIONAL COMPUTER SCIENCE OLYMPIAD BOARD
                      </h3>
                      <div className="inline-block px-3 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded uppercase mt-1 tracking-wider">
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
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Mains Roll Number</span>
                          <p className="font-mono font-black text-amber-600 text-sm">{student.stage2AdmitNumber || "ENO-S2-NOTGEN"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Olympiad Class Standard</span>
                          <p className="font-bold text-slate-900">{student.classLevel} Division</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Enrollment Identifier</span>
                          <p className="font-mono text-slate-700 font-semibold">{student.id}</p>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-200" />

                    {/* Date, Timing, allocated Center */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-blue-100 p-4 rounded-lg bg-blue-50/40 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Mains Exam Scheduled Date</span>
                        <p className="font-black text-slate-950 mt-0.5">{schedule?.mainExamDate}</p>
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
                        <p className="font-display font-semibold text-slate-950 text-xs italic tracking-wider mt-1 block">Dr. Sandeep Singh</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* OLYMPIAD SYLLABUS PANEL */}
          {activeTab === 'syllabus' && (
            <div className="space-y-6">
              <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-950">Official Curriculum Guidelines</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose a group from the curriculum menu below to review detailed IT, programming, relational databases, and logical reasoning sub-topics.
                  </p>
                </div>

                {/* Group Selector Menu */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(OLYMPIAD_SYLLABUS).map(([id, syllabus]) => {
                    const isSelect = selectedSyllabusId === id;
                    const isOwnGroup = classGroup === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedSyllabusId(id)}
                        className={`p-3 rounded-xl border text-left transition relative cursor-pointer ${
                          isSelect
                            ? 'bg-blue-600 border-blue-600 text-white shadow'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="font-extrabold text-[10px] uppercase tracking-wider font-mono">
                          Group {id === '5-6' ? 'A' : id === '7-8' ? 'B' : id === '9-10' ? 'C' : 'D'}
                        </div>
                        <div className={`text-xs font-bold mt-1 ${isSelect ? 'text-blue-100' : 'text-slate-950'}`}>
                          Class {id} Preset
                        </div>
                        {isOwnGroup && (
                          <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                            isSelect ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                          }`}>
                            Your Group
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Syllabus Breakdown Details Card */}
              {selectedSyllabusId && OLYMPIAD_SYLLABUS[selectedSyllabusId] && (
                <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="pb-4 border-b">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-850 rounded-full text-[10px] font-bold font-mono">
                      <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                      OFFICIAL CURRICULUM PRESET
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-2 font-display">
                      {OLYMPIAD_SYLLABUS[selectedSyllabusId].title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {OLYMPIAD_SYLLABUS[selectedSyllabusId].description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {OLYMPIAD_SYLLABUS[selectedSyllabusId].modules.map((mod, mIdx) => (
                      <div key={mIdx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-600 block">
                          Curriculum Module {mIdx + 1}
                        </span>
                        <h5 className="font-extrabold text-sm text-slate-900 border-b pb-2">
                          {mod.name}
                        </h5>
                        <ul className="space-y-2">
                          {mod.topics.map((topic, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2 text-xs text-slate-600">
                              <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                              <span className="font-medium">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 text-blue-900 p-4 rounded-xl border border-blue-100 text-xs leading-relaxed flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold">Olympiad Trial Notes:</span> All trial mock exams generated dynamically from the portal comply strictly with this curriculum. Keep reviewing to maximize your potential scoring results.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STUDY MATERIALS PANEL */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-950">National Olympiad Study Materials</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enhance your learning with expert-curated books, previous years' question papers, and interactive kits.
                </p>
              </div>

              {dbItems.length === 0 ? (
                <div className="p-8 bg-white text-center rounded-xl border border-dashed space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-500">No study materials are currently available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {dbItems.map((item, idx) => (
                    <div key={idx} className="bg-white border rounded-2xl p-5 flex flex-col justify-between shadow-sm relative hover:shadow-md transition">
                      <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase">
                        {item.category}
                      </span>

                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-extrabold font-mono">
                          {idx + 1}
                        </div>
                        <h4 className="font-bold text-slate-950 font-display text-base leading-tight">{item.name}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-light">{item.description}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900 font-mono">
                          {Number(item.price) === 0 ? 'FREE' : `₹${item.price}`}
                        </span>
                        <button
                          onClick={() => alert(`Unlocked resource: ${item.name}! You can download or view this from your resources dashboard.`)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition active:scale-98"
                        >
                          {Number(item.price) === 0 ? 'Access Resource' : 'Unlock Now'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
