import { useState, useEffect } from 'react';
import { Student, School, MockExam, StudentExamAttempt, Announcement, ExamCenter, DBItem, ExamSchedule } from '../../../types';

interface UseStudentDataProps {
  user: any;
  onLogout: () => void;
}

export function useStudentData({ user, onLogout }: UseStudentDataProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'history' | 'admitCard' | 'syllabus' | 'profile'>('overview');
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

  // Active Exam State
  const [activeExam, setActiveExam] = useState<MockExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examSecondsLeft, setExamSecondsLeft] = useState(0);
  const [examIntervalId, setExamIntervalId] = useState<any>(null);
  const [examSubmitted, setExamSubmitted] = useState<any | null>(null);

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

  const mapClassToGroup = (cl: string): string => {
    if (cl.includes('5') || cl.includes('6')) return '5-6';
    if (cl.includes('7') || cl.includes('8')) return '7-8';
    if (cl.includes('9') || cl.includes('10')) return '9-10';
    return '11-12';
  };

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

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const simulatePayment = async () => {
    if (!student) return;
    try {
      const res = await fetch(`/api/students/${student.id}/pay`, { method: 'POST' });
      if (res.ok) {
        alert("Payment Successful! Mock Razorpay gateway synchronized.");
        fetchDashboardData();
      } else {
        alert("Payment simulation failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing payment.");
    }
  };

  return {
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
  };
}
