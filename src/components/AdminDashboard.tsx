import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Users, 
  Building, 
  Settings, 
  Plus, 
  Rss, 
  Check, 
  X, 
  CreditCard, 
  Layers, 
  MapPin, 
  Clock, 
  Calendar, 
  FileText, 
  Send, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  Search,
  BookOpen,
  PieChart,
  Grid,
  Sparkles,
  Brain,
  ArrowLeft,
  Mail,
  Phone,
  User
} from 'lucide-react';
import { School, Student, MockExam, Announcement, ExamCenter, OLYMPIAD_SYLLABUS, DBUser, DBItem, ExamSchedule } from '../types';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<MockExam[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [centers, setCenters] = useState<ExamCenter[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedSchoolProfile, setSelectedSchoolProfile] = useState<School | null>(null);
  
  const [activeTab, setActiveTab] = useState<'approvals' | 'students' | 'exams' | 'broadcasting' | 'centers' | 'database' | 'schedule'>('approvals');
  const [dbItems, setDbItems] = useState<DBItem[]>([]);
  const [dbUsers, setDbUsers] = useState<DBUser[]>([]);

  // Exam Schedule states
  const [schedule, setSchedule] = useState<ExamSchedule>({
    preExamDate: '',
    preExamTime: '',
    preExamDuration: '',
    mainExamDate: '',
    mainExamTime: '',
    mainExamDuration: ''
  });
  const [scheduleSuccess, setScheduleSuccess] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleSaving, setScheduleSaving] = useState(false);

  // School Pre-Exam Schedule Management states
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState<string>('All');
  const [scheduleStartDateFilter, setScheduleStartDateFilter] = useState<string>('');
  const [scheduleEndDateFilter, setScheduleEndDateFilter] = useState<string>('');
  const [scheduleSearchFilter, setScheduleSearchFilter] = useState<string>('');

  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [editPreExamDate, setEditPreExamDate] = useState<string>('');
  const [editPreExamTime, setEditPreExamTime] = useState<string>('');
  const [editPreExamDuration, setEditPreExamDuration] = useState<string>('');
  const [editSaveError, setEditSaveError] = useState<string>('');
  const [editSaveSuccess, setEditSaveSuccess] = useState<string>('');
  const [editSaving, setEditSaving] = useState<boolean>(false);

  // DB Item Form States
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemCategory, setNewItemCategory] = useState('Study Material');

  const [selectedAdminSyllabusId, setSelectedAdminSyllabusId] = useState<string>('5-6');
  const [loading, setLoading] = useState(true);

  // Passing Marks Configuration States
  const [passingMarksEdit, setPassingMarksEdit] = useState<Record<string, number>>({});
  const [savingPassingMarks, setSavingPassingMarks] = useState(false);
  const [passingMarksSuccess, setPassingMarksSuccess] = useState('');
  const [passingMarksError, setPassingMarksError] = useState('');

  // Search filter
  const [schoolSearch, setSchoolSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [schoolRosterSearch, setSchoolRosterSearch] = useState('');
  const [schoolRosterClassFilter, setSchoolRosterClassFilter] = useState('ALL');

  // AI Mock Generator Form States
  const [aiGroup, setAiGroup] = useState('5-6');
  const [aiDifficulty, setAiDifficulty] = useState('MODERATE');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [aiDuration, setAiDuration] = useState(45);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');
  const [aiPreviewExam, setAiPreviewExam] = useState<MockExam | null>(null);
  const [aiError, setAiError] = useState('');

  // New Exam creation is strictly handled by editing the AI draft/preview before publishing.

  // New Announcement Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'ALL' | 'SCHOOLS' | 'STUDENTS'>('ALL');

  // New Exam Center Form State
  const [cenName, setCenName] = useState('');
  const [cenCity, setCenCity] = useState('');
  const [cenCap, setCenCap] = useState(200);

  // Result Upload State definitions
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkStatusMessage, setBulkStatusMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Fetch schools
      const sRes = await fetch('/api/schools');
      const sData = await sRes.json();
      setSchools(sData);

      // Fetch students
      const stRes = await fetch('/api/students');
      const stData = await stRes.json();
      setStudents(stData);

      // Fetch mock exams
      const exRes = await fetch('/api/exams');
      const exData = await exRes.json();
      setExams(exData);

      // Fetch announcements
      const ancRes = await fetch('/api/announcements');
      const ancData = await ancRes.json();
      setAnnouncements(ancData);

      // Fetch centers
      const cenRes = await fetch('/api/centers');
      const cenData = await cenRes.json();
      setCenters(cenData);

      // Fetch overall stats counters
      const statRes = await fetch('/api/stats');
      const statData = await statRes.json();
      setStats(statData);

      // Fetch database users from PostgreSQL endpoint
      try {
        const uRes = await fetch('/api/db/users');
        if (uRes.ok) {
          const uData = await uRes.json();
          setDbUsers(uData);
        }
      } catch (err) {
        console.error("Error fetching database users:", err);
      }

      // Fetch database items from PostgreSQL endpoint
      try {
        const iRes = await fetch('/api/db/items');
        if (iRes.ok) {
          const iData = await iRes.json();
          setDbItems(iData);
        }
      } catch (err) {
        console.error("Error fetching database items:", err);
      }

      // Fetch exam schedule
      try {
        const schRes = await fetch('/api/exam-schedule');
        if (schRes.ok) {
          const schData = await schRes.json();
          setSchedule({
            preExamDate: schData.preExamDate || '',
            preExamTime: schData.preExamTime || '',
            preExamDuration: schData.preExamDuration || '',
            mainExamDate: schData.mainExamDate || '',
            mainExamTime: schData.mainExamTime || '',
            mainExamDuration: schData.mainExamDuration || ''
          });
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
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (selectedSchoolProfile) {
      setPassingMarksEdit(selectedSchoolProfile.passingMarks || {});
    } else {
      setPassingMarksEdit({});
    }
    setPassingMarksSuccess('');
    setPassingMarksError('');
  }, [selectedSchoolProfile]);

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSaving(true);
    setScheduleSuccess('');
    setScheduleError('');

    try {
      const res = await fetch('/api/exam-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule)
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setScheduleSuccess('Olympiad Exam Schedule settings saved and distributed successfully.');
        setSchedule(data.schedule);
      } else {
        setScheduleError(data.error || 'Failed to save schedule settings.');
      }
    } catch (err: any) {
      setScheduleError(err.message || 'Network error occurred while saving schedule.');
    } finally {
      setScheduleSaving(false);
    }
  };


  const handleApproveSchool = async (schoolId: string) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/approve`, { method: 'POST' });
      if (!response.ok) throw new Error("Approval failed");
      alert("School request approved! Autogenerated SCH-ID has been synced.");
      fetchAdminData();
    } catch (err) {
      alert("Error approving school");
    }
  };

  const handleRejectSchool = async (schoolId: string) => {
    if (!confirm("Are you sure you want to reject this registration request?")) return;
    try {
      const response = await fetch(`/api/schools/${schoolId}/reject`, { method: 'POST' });
      if (!response.ok) throw new Error("Rejection failed");
      alert("Registration request rejected.");
      fetchAdminData();
    } catch (err) {
      alert("Error rejecting school");
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!confirm("Are you sure you want to delete this school from the database? This will permanently remove its credentials and portal access.")) return;
    try {
      const response = await fetch(`/api/schools/${schoolId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Deletion failed");
      alert("School successfully deleted.");
      fetchAdminData();
    } catch (err) {
      alert("Error deleting school");
    }
  };

  const handleApproveCandidatePayment = async (studentId: string) => {
    if (!confirm("Are you sure you want to approve registration for this candidate? This will record a cash payment, generate their admit card, and send their welcome credentials email.")) return;
    try {
      const response = await fetch(`/api/students/${studentId}/approve-payment`, { method: 'POST' });
      if (!response.ok) throw new Error("Approval failed");
      alert("Candidate registration approved successfully!");
      fetchAdminData();
      if (selectedSchoolProfile) {
        const updatedRes = await fetch('/api/schools');
        const updatedSchools = await updatedRes.json();
        const updatedSch = updatedSchools.find((s: any) => s.id === selectedSchoolProfile.id);
        if (updatedSch) {
          setSelectedSchoolProfile(updatedSch);
        }
      }
    } catch (err) {
      alert("Error approving candidate registration");
    }
  };

  const handleManualQualify = async (studentId: string, status: 'QUALIFIED' | 'NOT_QUALIFIED' | 'TBD') => {
    try {
      const response = await fetch(`/api/students/${studentId}/qualify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualificationStatus: status })
      });
      if (!response.ok) throw new Error("Qualify action failed");
      fetchAdminData();
    } catch (err) {
      alert("Error setting qualification status");
    }
  };

  const handleStage1Release = async (studentId: string, release: boolean) => {
    try {
      const response = await fetch(`/api/students/${studentId}/stage1-release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ release })
      });
      if (!response.ok) throw new Error("Stage 1 action failed");
      fetchAdminData();
    } catch (err) {
      alert("Error toggling Stage 1 admit release state");
    }
  };

  const handleStage2Release = async (studentId: string, release: boolean) => {
    try {
      const response = await fetch(`/api/students/${studentId}/stage2-release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ release })
      });
      if (!response.ok) throw new Error("Stage 2 action failed");
      fetchAdminData();
    } catch (err) {
      alert("Error toggling Stage 2 admit release state");
    }
  };

  const handleAllocateCenter = async (studentId: string, examCenterId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/allocate-center`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examCenterId })
      });
      if (!response.ok) throw new Error("Center allocation failed");
      fetchAdminData();
    } catch (err) {
      alert("Error allocating exam center location");
    }
  };

  const handleUpdateScore = async (studentId: string, score: number) => {
    try {
      const response = await fetch(`/api/students/${studentId}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score })
      });
      if (!response.ok) throw new Error("Update score failed");
      fetchAdminData();
    } catch (err) {
      alert("Error updating candidate score");
    }
  };

  const handleSavePassingMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolProfile) return;

    setSavingPassingMarks(true);
    setPassingMarksSuccess('');
    setPassingMarksError('');

    try {
      const response = await fetch(`/api/schools/${selectedSchoolProfile.id}/passing-marks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passingMarks: passingMarksEdit })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setPassingMarksSuccess(`Passing marks updated successfully! Re-evaluated qualification for ${data.updatedStudentsCount} students.`);
        setSchools(prev => prev.map(s => s.id === selectedSchoolProfile.id ? data.school : s));
        setSelectedSchoolProfile(data.school);
        
        // Refresh students because qualification statuses updated
        const stRes = await fetch('/api/students');
        const stData = await stRes.json();
        setStudents(stData);
        
        // Refresh overall stats
        const statRes = await fetch('/api/stats');
        const statData = await statRes.json();
        setStats(statData);
      } else {
        setPassingMarksError(data.error || 'Failed to save passing marks.');
      }
    } catch (err: any) {
      setPassingMarksError(err.message || 'Error occurred while saving passing marks.');
    } finally {
      setSavingPassingMarks(false);
    }
  };

  const handleBulkUploadResultsSubmit = async (pastedCsv: string) => {
    try {
      if (!pastedCsv.trim()) {
        alert("Please paste some result logs first.");
        return;
      }
      const lines = pastedCsv.split('\n');
      const results: { identifier: string; score: number }[] = [];
      for (const line of lines) {
        if (!line.trim()) continue;
        const [rawId, rawScore] = line.split(',');
        if (!rawId || !rawScore) continue;
        const parsedScore = parseInt(rawScore.trim());
        if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100) {
          results.push({
            identifier: rawId.trim(),
            score: parsedScore
          });
        }
      }

      if (results.length === 0) {
        alert("No valid CSV rows parsed. Format must be: 'CandidateID,Score' or 'Email,Score' (e.g. ENO-ST-33827, 85)");
        return;
      }

      const response = await fetch('/api/students/bulk-results-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results })
      });

      if (!response.ok) throw new Error("Bulk upload server rejected action");
      const data = await response.json();
      setBulkStatusMessage(`Successfully updated ${data.processedCount} of ${data.totalReceived} matched candidate score records!`);
      setBulkInputText('');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Error submitting bulk results logs");
    }
  };

  // Handlers for modifying the AI draft/preview before publishing
  const handleEditPreviewTitle = (newVal: string) => {
    if (!aiPreviewExam) return;
    setAiPreviewExam({
      ...aiPreviewExam,
      title: newVal
    });
  };

  const handleEditPreviewDuration = (newVal: number) => {
    if (!aiPreviewExam) return;
    setAiPreviewExam({
      ...aiPreviewExam,
      durationMinutes: newVal
    });
  };

  const handleEditPreviewClassGroup = (newVal: string) => {
    if (!aiPreviewExam) return;
    setAiPreviewExam({
      ...aiPreviewExam,
      classGroup: newVal
    });
  };

  const handleEditPreviewQuestionText = (qIdx: number, text: string) => {
    if (!aiPreviewExam) return;
    const updatedQs = [...aiPreviewExam.questions];
    updatedQs[qIdx] = { ...updatedQs[qIdx], question: text };
    setAiPreviewExam({
      ...aiPreviewExam,
      questions: updatedQs,
      totalQuestions: updatedQs.length
    });
  };

  const handleEditPreviewQuestionOption = (qIdx: number, oIdx: number, optionVal: string) => {
    if (!aiPreviewExam) return;
    const updatedQs = [...aiPreviewExam.questions];
    const updatedOpts = [...updatedQs[qIdx].options];
    updatedOpts[oIdx] = optionVal;
    updatedQs[qIdx] = { ...updatedQs[qIdx], options: updatedOpts };
    setAiPreviewExam({
      ...aiPreviewExam,
      questions: updatedQs
    });
  };

  const handleEditPreviewQuestionCorrectOption = (qIdx: number, correctIdx: number) => {
    if (!aiPreviewExam) return;
    const updatedQs = [...aiPreviewExam.questions];
    updatedQs[qIdx] = { ...updatedQs[qIdx], correctOption: correctIdx };
    setAiPreviewExam({
      ...aiPreviewExam,
      questions: updatedQs
    });
  };

  const handleDeletePreviewQuestion = (qIdx: number) => {
    if (!aiPreviewExam) return;
    const updatedQs = aiPreviewExam.questions.filter((_, idx) => idx !== qIdx);
    setAiPreviewExam({
      ...aiPreviewExam,
      questions: updatedQs,
      totalQuestions: updatedQs.length
    });
  };

  const handleAddPreviewQuestionSlot = () => {
    if (!aiPreviewExam) return;
    const nextQId = `Q-${aiPreviewExam.id}-${aiPreviewExam.questions.length + 1}`;
    const newQ = {
      id: nextQId,
      question: "New Custom Technical Question Statement",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctOption: 0
    };
    const updatedQs = [...aiPreviewExam.questions, newQ];
    setAiPreviewExam({
      ...aiPreviewExam,
      questions: updatedQs,
      totalQuestions: updatedQs.length
    });
  };

  const handlePublishAIExam = async () => {
    if (!aiPreviewExam) return;
    if (!aiPreviewExam.title.trim()) {
      alert("Please provide a valid exam title before publishing.");
      return;
    }
    if (aiPreviewExam.questions.length === 0) {
      alert("Please ensure the exam has at least one question before publishing.");
      return;
    }
    if (aiPreviewExam.questions.some(q => !q.question.trim())) {
      alert("Please ensure all questions have filled statements.");
      return;
    }

    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aiPreviewExam.title,
          classGroup: aiPreviewExam.classGroup,
          durationMinutes: Number(aiPreviewExam.durationMinutes),
          questions: aiPreviewExam.questions
        })
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || "Failed to finalize published mock exam.");
      }

      alert("AI-Generated Mock Exam successfully edited, approved, and published! It is now active and visible in the student portal.");
      setAiPreviewExam(null); // Clear active draft
      fetchAdminData(); // Refresh active list
    } catch (err: any) {
      alert("An error occurred while publishing: " + err.message);
    }
  };

  const handleAIGenerateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiGenerating(true);
    setAiError('');
    setAiPreviewExam(null);
    
    // Custom status messages for authentic progress feedback
    const messages = [
      "Contacting Google Gemini engine...",
      "Analyzing computer science curricula parameters...",
      "Generating multiple choice questions...",
      "Verifying single-correct-answer constraints...",
      "Rendering final mock trial data structure..."
    ];
    
    let currentIdx = 0;
    setAiStatusMessage(messages[0]);
    const timer = setInterval(() => {
      currentIdx = (currentIdx + 1) % messages.length;
      setAiStatusMessage(messages[currentIdx]);
    }, 2800);

    try {
      const response = await fetch('/api/exams/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classGroup: aiGroup,
          difficulty: aiDifficulty,
          topic: aiTopic,
          numQuestions: aiCount,
          durationMinutes: aiDuration
        })
      });

      clearInterval(timer);

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || "Failed to finalize generated test structure.");
      }

      const outcome = await response.json();
      setAiPreviewExam(outcome.exam);
      setAiStatusMessage("Mock exam generated successfully!");
      fetchAdminData();
    } catch (err: any) {
      clearInterval(timer);
      setAiError(err.message || "An unexpected error occurred during AI generation workflow.");
    } finally {
      clearInterval(timer);
      setAiGenerating(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noticeTitle,
          content: noticeContent,
          audience: noticeAudience
        })
      });

      if (!response.ok) throw new Error();
      alert("Broadsheet notice announcement released to portal databases successfully.");
      setNoticeTitle('');
      setNoticeContent('');
      fetchAdminData();
    } catch (e) {
      alert("Failed to broadcast.");
    }
  };

  const handleCreateCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cenName || !cenCity || !cenCap) return;

    try {
      const response = await fetch('/api/centers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cenName, city: cenCity, capacity: Number(cenCap) })
      });
      if (!response.ok) throw new Error();
      alert("National Exam Proctored Center added successfully!");
      setCenName('');
      setCenCity('');
      fetchAdminData();
    } catch (e) {
      alert("Failed saving center.");
    }
  };

  const handleCreateDBItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemDesc || newItemPrice < 0 || !newItemCategory) {
      alert("Please fill all item fields properly.");
      return;
    }
    try {
      const response = await fetch('/api/db/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName,
          description: newItemDesc,
          price: newItemPrice,
          category: newItemCategory
        })
      });
      if (!response.ok) throw new Error("Failed to create item");
      alert("New Olympiad resource item added successfully!");
      setNewItemName('');
      setNewItemDesc('');
      setNewItemPrice(0);
      fetchAdminData();
    } catch (err: any) {
      alert("Error adding item: " + err.message);
    }
  };

  const handleDeleteDBItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this study resource?")) return;
    try {
      const response = await fetch(`/api/db/items/${itemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Failed to delete item");
      alert("Olympiad resource item deleted successfully!");
      fetchAdminData();
    } catch (err: any) {
      alert("Error deleting item: " + err.message);
    }
  };

  const pendingRequests = schools.filter(s => s.status === 'PENDING');
  const approvedSchools = schools.filter(s => s.status === 'APPROVED');

  const filteredSchoolsRef = schools.filter(s => 
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) || 
    s.city.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const filteredStudentsRef = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.classLevel.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Helpers for school-wise scheduling
  const getSchoolExamStatus = (school: School) => {
    if (!school.preExamDate || school.preExamDate.trim() === '') return 'Not Scheduled';
    const parsed = Date.parse(school.preExamDate);
    if (isNaN(parsed)) return 'Not Scheduled';
    
    const examDate = new Date(parsed);
    examDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (examDate.getTime() === today.getTime()) return 'Active';
    if (examDate.getTime() > today.getTime()) return 'Upcoming';
    return 'Completed';
  };

  const filteredSchoolsForScheduling = schools.filter(school => {
    if (school.status !== 'APPROVED') return false;

    // Search filter
    if (scheduleSearchFilter) {
      const term = scheduleSearchFilter.toLowerCase();
      if (!school.name.toLowerCase().includes(term) && 
          !school.id.toLowerCase().includes(term) && 
          !(school.coordinatorName || '').toLowerCase().includes(term)) {
        return false;
      }
    }

    // Status filter
    const status = getSchoolExamStatus(school);
    if (scheduleStatusFilter !== 'All' && status !== scheduleStatusFilter) {
      return false;
    }

    // Date range filter
    if (school.preExamDate) {
      const parsedDate = Date.parse(school.preExamDate);
      if (!isNaN(parsedDate)) {
        const examTime = new Date(parsedDate).getTime();
        if (scheduleStartDateFilter) {
          const startLimit = new Date(scheduleStartDateFilter).getTime();
          if (examTime < startLimit) return false;
        }
        if (scheduleEndDateFilter) {
          const endLimit = new Date(scheduleEndDateFilter).getTime();
          if (examTime > endLimit) return false;
        }
      } else if (scheduleStartDateFilter || scheduleEndDateFilter) {
        return false;
      }
    } else if (scheduleStartDateFilter || scheduleEndDateFilter) {
      return false;
    }

    return true;
  });

  const handleEditScheduleClick = (school: School) => {
    setEditingSchoolId(school.id);
    setEditPreExamDate(school.preExamDate || '');
    setEditPreExamTime(school.preExamTime || '');
    setEditPreExamDuration(school.preExamDuration || '120');
    setEditSaveError('');
    setEditSaveSuccess('');
  };

  const handleSaveSchoolSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchoolId) return;

    setEditSaving(true);
    setEditSaveError('');
    setEditSaveSuccess('');

    try {
      const res = await fetch(`/api/schools/${editingSchoolId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preExamDate: editPreExamDate,
          preExamTime: editPreExamTime,
          preExamDuration: editPreExamDuration
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setEditSaveSuccess('School Pre-Exam schedule updated successfully. Notification emails sent.');
        setSchools(prev => prev.map(s => s.id === editingSchoolId ? data.school : s));
        setTimeout(() => {
          setEditingSchoolId(null);
          setEditSaveSuccess('');
        }, 1500);
      } else {
        setEditSaveError(data.error || 'Failed to save school schedule.');
      }
    } catch (err: any) {
      setEditSaveError(err.message || 'Error saving school schedule.');
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="eno-admin-panel">
      
      {/* Admin header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-white">NATIONAL OLYMPIAD BOARD</h2>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Superadmin Control Matrix • Delhi HQ Office</p>
          </div>
        </div>

        <button 
          id="btn-admin-logout"
          onClick={onLogout} 
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 px-3 py-1.5 text-white font-bold text-xs rounded-lg transition"
        >
          <X className="w-3.5 h-3.5" />
          Logout Control Panel
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Toolbar Drawer */}
        <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-4 shrink-0 justify-between">
          <div className="space-y-1">
            <div className="p-3 mb-4 bg-slate-900 text-blue-300 rounded-xl">
              <span className="text-[9px] uppercase tracking-widest font-bold">SYSTEM METRICS</span>
              <h5 className="text-sm font-bold text-white font-display mt-0.5">Control Terminal</h5>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px]">
                <span>Earning Pool:</span>
                <span className="text-emerald-400 font-bold font-mono">₹{stats ? stats.totalEarnings : 0}</span>
              </div>
            </div>

            <button
              onClick={() => { setActiveTab('approvals'); setSelectedSchoolProfile(null); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'approvals' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="w-4.5 h-4.5" />
              School Requests ({pendingRequests.length})
            </button>

            <button
              onClick={() => { setActiveTab('students'); setSelectedSchoolProfile(null); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'students' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              Manage Students
            </button>

            <button
              onClick={() => { setActiveTab('exams'); setSelectedSchoolProfile(null); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'exams' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4.5 h-4.5" />
              Mock Exam Composer
            </button>

            <button
              onClick={() => { setActiveTab('broadcasting'); setSelectedSchoolProfile(null); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'broadcasting' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Rss className="w-4.5 h-4.5" />
              Notice Broadcaster
            </button>

            <button
              onClick={() => { setActiveTab('centers'); setSelectedSchoolProfile(null); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'centers' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4.5 h-4.5" />
              Exam Centers Desk
            </button>

             <button
              onClick={() => { setActiveTab('schedule'); setSelectedSchoolProfile(null); }}
              id="btn-schedule-desk"
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'schedule' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4.5 h-4.5" />
              Exam Schedule Desk
            </button>
          </div>

          <div className="bg-slate-950 text-white p-3.5 rounded-xl text-center border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase">SECURE SESSION</span>
            <p className="text-[10px] text-emerald-400 font-bold block mt-1">● VERIFIED ONLINE</p>
          </div>
        </aside>

        {/* Dynamic content area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {selectedSchoolProfile ? (
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
                          try {
                            const response = await fetch(`/api/schools/${selectedSchoolProfile.id}/approve`, { method: 'POST' });
                            if (!response.ok) throw new Error("Approval failed");
                            alert("School request approved! Autogenerated SCH-ID has been synced.");
                            fetchAdminData();
                            setSelectedSchoolProfile(null);
                          } catch (err) {
                            alert("Error approving school");
                          }
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
                        if (confirm("Are you sure you want to delete this school from the database? This will permanently remove its credentials and portal access.")) {
                          try {
                            const response = await fetch(`/api/schools/${selectedSchoolProfile.id}`, { method: 'DELETE' });
                            if (!response.ok) throw new Error("Deletion failed");
                            alert("School successfully deleted.");
                            fetchAdminData();
                            setSelectedSchoolProfile(null);
                          } catch (err) {
                            alert("Error deleting school");
                          }
                        }
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
                    {selectedSchoolProfile.boardType} Board Affiliated • Established Record Directory
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
                        {selectedSchoolProfile.totalStudents} Candidates
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
                  {/* Secure Passwords / Credentials Panel */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Administrative Keys</h3>
                    
                    {selectedSchoolProfile.status === 'APPROVED' ? (
                      <div className="space-y-3">
                        <div className="bg-slate-50 border p-3 rounded-lg text-xs">
                          <span className="text-slate-400 font-medium">Portal Password</span>
                          <p className="font-mono font-bold text-slate-800 mt-0.5">{selectedSchoolProfile.password || 'school123'}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-[10px] text-blue-800 font-semibold leading-relaxed">
                          Tip: Provide these credentials to coordinator teachers. They can log in to the School Dashboard to register students and check admit cards.
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 py-4 text-center">
                        Credentials will be generated automatically and sent via email upon approval of this enrollment request.
                      </div>
                    )}
                  </div>

                  {/* Pre-Exam Qualification Thresholds Panel */}
                  {selectedSchoolProfile.status === 'APPROVED' && (
                    <form onSubmit={handleSavePassingMarks} className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="border-b pb-2 flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-900">Pre-Exam Thresholds</h3>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Define the minimum score (%) required to qualify for Stage 2 Mains per class level. (Default is 60%)
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
                    <select
                      value={schoolRosterClassFilter}
                      onChange={(e) => setSchoolRosterClassFilter(e.target.value)}
                      className="bg-white border rounded-lg p-2 font-semibold cursor-pointer outline-none text-slate-800"
                    >
                      <option value="ALL">All Classes</option>
                      {["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
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
                            <th className="p-3">Payment Status</th>
                            <th className="p-3">Pre Exam Marks</th>
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
                                <div className="flex items-center gap-1.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                    st.paymentStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                                  }`}>
                                    {st.paymentStatus}
                                  </span>
                                  {st.paymentStatus !== 'COMPLETED' && (
                                    <button
                                      onClick={() => handleApproveCandidatePayment(st.id)}
                                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 font-extrabold px-1.5 py-0.5 rounded text-[9px] transition cursor-pointer border border-emerald-200 focus:outline-none"
                                    >
                                      Approve Cash
                                    </button>
                                  )}
                                </div>
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
          ) : (
            <>
              {/* Main quick stats block strip */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            
            <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Approved Campuses</span>
                <p className="text-2xl font-black font-display text-slate-950 mt-1">{stats ? stats.approvedSchools : 0}</p>
              </div>
              <div className="bg-blue-50 p-3 text-blue-600 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Registered Candidates</span>
                <p className="text-2xl font-black font-display text-slate-950 mt-1">{stats ? stats.totalStudents : 0}</p>
              </div>
              <div className="bg-purple-50 p-3 text-purple-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Olympiad Earnings Pool</span>
                <p className="text-2xl font-black font-display text-emerald-600 mt-1">₹{stats ? stats.totalEarnings : 0}</p>
              </div>
              <div className="bg-emerald-50 p-3 text-emerald-600 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 relative flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider text-indigo-800">Stage 2 Mains Qualifiers</span>
                <p className="text-xl font-black font-display text-indigo-700 mt-1">{stats ? stats.qualifiedStudents : 0} Candidates</p>
              </div>
              <div className="bg-indigo-50 p-3 text-indigo-600 rounded-xl">
                <Award className="w-5 h-5 anima-pulse" />
              </div>
            </div>

          </div>

          {/* TAB 1: CAMPUS APPROVALS PROCESS */}
          {activeTab === 'approvals' && (
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
                      {filteredSchoolsRef.map((sch, i) => (
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
          )}

          {/* TAB 2: MANAGE STUDENTS DIRECTORY */}
          {activeTab === 'students' && (
            <div className="space-y-6">               <div className="bg-white border rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-950">Master Candidates Database</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Override qualifier flags or allocate admit card serial credentials directly.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setIsBulkUploadOpen(!isBulkUploadOpen);
                        setBulkStatusMessage("");
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer select-none border whitespace-nowrap ${
                        isBulkUploadOpen 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
                      }`}
                    >
                      📊 Bulk Upload Results
                    </button>

                    <div className="relative text-xs w-full sm:w-48 md:w-64">
                      <Search className="absolute left-2.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search candidate name or class..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full bg-slate-50 border p-2 pl-9 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {isBulkUploadOpen && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                        <span>📂 CSV/Excel Bulk Results Injector Tool</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsBulkUploadOpen(false)}
                        className="text-slate-400 hover:text-slate-600 font-extrabold text-[10px] uppercase cursor-pointer"
                      >
                        ✕ Close Tool
                      </button>
                    </div>

                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Paste your CSV result logs below. Each row must contain a candidate identification key (Unique Student ID like <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1 rounded">ENO-ST-XXXXX</span> or registered Email) followed by their score value separated by a comma (e.g. <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1 rounded">ENO-ST-83120, 95</span>). Score values must range from <span className="font-semibold text-slate-700">0 to 100</span>. Any matched candidates' qualifiers will update accordingly.
                    </p>

                    {bulkStatusMessage && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg font-bold flex items-center gap-1.5 text-[11px]">
                        <span>✅</span>
                        <span>{bulkStatusMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Raw input logs */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">CSV/Logs Raw Paste Panel</label>
                        <textarea
                          rows={6}
                          placeholder={`ENO-ST-83120, 92&#10;ENO-ST-12495, 88&#10;candidate@email.com, 74`.replace(/&#10;/g, '\n')}
                          value={bulkInputText}
                          onChange={(e) => setBulkInputText(e.target.value)}
                          className="w-full font-mono bg-white border border-slate-200 rounded-lg p-2.5 text-[11px] leading-relaxed outline-none focus:border-blue-500 shadow-inner h-[135px]"
                        />
                      </div>

                      {/* Right: Real-time Pre-validation mapping */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Real-time Verified Mapping State</label>
                        <div className="bg-white border rounded-lg p-3 flex-1 overflow-y-auto h-[135px] max-h-[135px] space-y-1 font-mono text-[10px] text-slate-600">
                          {(() => {
                            if (!bulkInputText.trim()) return <p className="text-slate-400 italic text-[11px] mt-10 text-center">Awaiting CSV pasting feed for parsing validation...</p>;
                            const parsedLines = bulkInputText.split('\n').filter(l => l.trim() !== '');
                            return parsedLines.map((line, idx) => {
                              const [rawId, rawScore] = line.split(',');
                              if (!rawId || !rawScore) {
                                return <div key={idx} className="text-red-500 mb-0.5 font-bold">⚠️ Line {idx+1}: Formatting error (Missing comma separator)</div>;
                              }
                              const valId = rawId.trim();
                              const valSc = parseInt(rawScore.trim());
                              if (isNaN(valSc) || valSc < 0 || valSc > 100) {
                                return <div key={idx} className="text-red-500 mb-0.5 font-bold">⚠️ Line {idx+1}: Invalid score value "{rawScore.trim()}" (Must be 0-100)</div>;
                              }
                              // Match student
                              const matched = students.find(s => s.id === valId || s.email?.toLowerCase().trim() === valId.toLowerCase().trim());
                              if (matched) {
                                return (
                                  <div key={idx} className="bg-emerald-50 text-emerald-800 p-1 border border-emerald-100 rounded flex justify-between">
                                    <span>🎯 matched: {matched.name} ({matched.classLevel})</span>
                                    <span className="font-bold">Sc: {valSc}%</span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div key={idx} className="bg-amber-50 text-amber-800 p-1 border border-amber-100 rounded flex justify-between">
                                    <span>❓ unregistered ID: "{valId}"</span>
                                    <span className="font-bold">Sc: {valSc}%</span>
                                  </div>
                                );
                              }
                            });
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBulkInputText("");
                          setBulkStatusMessage("");
                        }}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 font-semibold cursor-pointer"
                      >
                        Reset Log Board
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkUploadResultsSubmit(bulkInputText)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                      >
                        Publish Verified Results Set
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto text-[11px]">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-slate-700 border-b uppercase text-[9px] tracking-wider">
                        <th className="p-3 min-w-[200px]">Candidate Details</th>
                        <th className="p-3 min-w-[220px]">Stage 1 (In-Campus Venue & Release)</th>
                        <th className="p-3 text-center min-w-[170px]">Mains Selection</th>
                        <th className="p-3 min-w-[220px]">Stage 2 Seating Location</th>
                        <th className="p-3 text-right pr-6 min-w-[160px]">Stage 2 Mains Admit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700 font-medium">
                      {filteredStudentsRef.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-10 text-center text-slate-500">No matching student logs recorded inside databases.</td>
                        </tr>
                      ) : (
                        filteredStudentsRef.map((st, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            
                            {/* Column 1: Candidate Details & Fee */}
                            <td className="p-3 space-y-1">
                              <p className="font-extrabold text-slate-900 text-xs">{st.name}</p>
                              <div className="font-mono text-[9px] text-slate-500">
                                {st.id} • <span className="font-sans font-semibold text-blue-700">{st.classLevel}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">{st.email}</div>
                              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  st.paymentStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {st.paymentStatus}
                                </span>
                                {st.paymentStatus !== 'COMPLETED' && (
                                  <button
                                    type="button"
                                    onClick={() => handleApproveCandidatePayment(st.id)}
                                    className="text-[9px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-extrabold transition cursor-pointer"
                                  >
                                    Approve Cash
                                  </button>
                                )}
                                {st.score !== undefined ? (
                                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 border border-blue-100 rounded-full text-[9px] font-extrabold">
                                    Score: {st.score}%
                                  </span>
                                ) : (
                                  <span className="bg-slate-50 text-slate-400 px-1.5 py-0.5 border border-slate-200 rounded-full text-[9px] font-bold">
                                    No Score
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newScore = prompt(`Enter score (0-100) for ${st.name}:`, st.score !== undefined ? String(st.score) : "");
                                    if (newScore !== null) {
                                      const parsed = parseInt(newScore);
                                      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
                                        handleUpdateScore(st.id, parsed);
                                      } else {
                                        alert("Please enter a valid percentage score from 0 to 100.");
                                      }
                                    }
                                  }}
                                  className="text-[9px] text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-bold transition flex items-center gap-0.5 cursor-pointer ml-1"
                                >
                                  ✏️ {st.score !== undefined ? "Update" : "Add Result"}
                                </button>
                              </div>
                            </td>

                            {/* Column 2: Stage 1 Venue & Release */}
                            <td className="p-3 space-y-1">
                              <div className="text-slate-600 leading-tight">
                                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Exam Venue (Same School)</span>
                                <span className="font-semibold text-slate-800 text-[11px] block max-w-[210px] truncate">{st.schoolName}</span>
                              </div>
                              
                              {st.paymentStatus !== 'COMPLETED' ? (
                                <span className="text-slate-400 text-[10px] italic block">🔒 Restricted (Awaiting Payment)</span>
                              ) : (
                                <div className="pt-1 flex items-center gap-2">
                                  {st.stage1AdmitReleased ? (
                                    <>
                                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 font-mono text-[10px] rounded font-bold">
                                        Released: {st.stage1AdmitNumber || "PENDING"}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleStage1Release(st.id, false)}
                                        className="text-[9px] bg-slate-100 hover:bg-slate-200 hover:text-red-700 text-slate-500 font-extrabold px-1.5 py-0.5 rounded transition cursor-pointer"
                                      >
                                        Lock
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 text-[10px] rounded font-bold">
                                        Draft (Locked)
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleStage1Release(st.id, true)}
                                        className="text-[9px] bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-2 py-0.5 rounded transition cursor-pointer"
                                      >
                                        Release Admit
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Column 3: Mains Selection */}
                            <td className="p-3 text-center">
                              <div className="inline-flex flex-col gap-1 items-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-1.5 ${
                                  st.qualificationStatus === 'QUALIFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                  st.qualificationStatus === 'NOT_QUALIFIED' ? 'bg-red-100 text-red-800 border border-red-200' :
                                  'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                  {st.qualificationStatus === 'QUALIFIED' ? 'SELECTED (STAGE 2)' : 
                                   st.qualificationStatus === 'NOT_QUALIFIED' ? 'PARTICIPATED ONLY' : 'TBD (MOCK EVAL)'}
                                </span>
                                
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleManualQualify(st.id, 'QUALIFIED')}
                                    className={`px-2 py-1 rounded text-[9px] font-extrabold cursor-pointer transition ${
                                      st.qualificationStatus === 'QUALIFIED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    Select / Qualify
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleManualQualify(st.id, 'NOT_QUALIFIED')}
                                    className={`px-2 py-1 rounded text-[9px] font-extrabold cursor-pointer transition ${
                                      st.qualificationStatus === 'NOT_QUALIFIED' ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    Disqualify
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Column 4: Stage 2 Center Allocation */}
                            <td className="p-3">
                              {st.qualificationStatus !== 'QUALIFIED' ? (
                                <span className="text-slate-400 italic text-[10px]">🔒 Locked (Candidate Unqualified)</span>
                              ) : (
                                <div className="space-y-1.5 max-w-[210px]">
                                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Exam Center Seating Allocation</span>
                                  <select
                                    value={st.examCenterId || ""}
                                    onChange={(e) => handleAllocateCenter(st.id, e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-blue-500"
                                  >
                                    <option value="">-- No Location Scheduled --</option>
                                    {centers.map((center) => (
                                      <option key={center.id} value={center.id}>
                                        {center.name} ({center.city})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </td>

                            {/* Column 5: Stage 2 Admit Release Toggle */}
                            <td className="p-3 text-right pr-6">
                              {st.qualificationStatus !== 'QUALIFIED' ? (
                                <span className="text-slate-400 italic text-[10px]">🔒 Stage 2 Disabled</span>
                              ) : (
                                <div className="flex flex-col items-end gap-1.5">
                                  {st.stage2AdmitReleased ? (
                                    <>
                                      <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-300 font-mono text-[9px] rounded font-extrabold">
                                        Released: {st.stage2AdmitNumber || "ENO-S2-RANDOM"}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleStage2Release(st.id, false)}
                                        className="text-[9px] bg-slate-100 hover:bg-slate-200 hover:text-red-700 text-slate-500 font-extrabold px-1.5 py-0.5 rounded transition cursor-pointer"
                                      >
                                        Lock S2 Card
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 text-[9px] rounded font-bold">
                                        Draft {st.examCenterId ? "(Seated)" : "(No Seat)"}
                                      </span>
                                      <button
                                        type="button"
                                        disabled={!st.examCenterId}
                                        onClick={() => handleStage2Release(st.id, true)}
                                        title={!st.examCenterId ? "Assign an exam center before releasing admit card" : ""}
                                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded transition cursor-pointer ${
                                          st.examCenterId 
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                            : 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                                        }`}
                                      >
                                        Release S2 Mains
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MOCK EXAMS COMPOSER (CREATE MOCK EXAMS WITH QUESTIONS) */}
          {activeTab === 'exams' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Generator Form & Active Draft Previews */}
              <div className="xl:col-span-8 space-y-6">
                
                {/* Premium AI Generator Control Card */}
                <div className="bg-gradient-to-r from-slate-950 to-slate-900 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-6" id="ai-generator-panel">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold font-mono tracking-widest text-[9px] rounded-full uppercase animate-pulse" id="badge-ai-model">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        Gemini Server-Side Intelligence
                      </div>
                      <h3 className="text-lg font-black font-display text-white mt-2" id="title-ai-heading">AI-Powered Instant Olympiad Test Generator</h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Generate a fully functional, curriculum-aligned Computer Science Olympiad trial mock exam in a single click. Select a class group or pick a custom sub-topic from the syllabus guide sidebar.
                      </p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-2xl text-white shrink-0 border border-slate-700 hidden sm:block">
                      <Brain className="w-7 h-7 text-blue-400" />
                    </div>
                  </div>

                  <form onSubmit={handleAIGenerateExam} className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-5 text-slate-200" id="form-ai-inputs">
                    <div className="md:col-span-3">
                      <label className="font-bold text-slate-300 block mb-1.5">Class Cohort Group</label>
                      <select
                        id="select-ai-cohort"
                        value={aiGroup} onChange={(e) => setAiGroup(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-lg font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="5-6">Group A (Class 5th - 6th)</option>
                        <option value="7-8">Group B (Class 7th - 8th)</option>
                        <option value="9-10">Group C (Class 9th - 10th)</option>
                        <option value="11-12">Group D (Class 11th - 12th)</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="font-bold text-slate-300 block mb-1.5">Cognitive Difficulty Level</label>
                      <select
                        id="select-ai-difficulty"
                        value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 p-2.5 rounded-lg font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="EASY">EASY (Foundational Concepts)</option>
                        <option value="MODERATE">MODERATE (Logic & Analytics)</option>
                        <option value="HARD">HARD (Olympiad-Grade Complex Coding)</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="font-bold text-slate-300 block mb-1.5">Total Questions Count</label>
                      <select
                        id="select-ai-count"
                        value={aiCount} onChange={(e) => setAiCount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-705 border-slate-700/80 p-2.5 rounded-lg font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="3">3 MCQ Questions</option>
                        <option value="5">5 MCQ Questions</option>
                        <option value="10">10 MCQ Questions</option>
                        <option value="15">15 MCQ Questions</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="font-bold text-slate-300 block mb-1.5">Duration (Minutes)</label>
                      <input
                        id="input-ai-duration"
                        type="number" required min="10" max="120"
                        value={aiDuration} onChange={(e) => setAiDuration(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700/80 p-2.5 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-12">
                      <label className="font-bold text-slate-300 block mb-1.5 flex justify-between">
                        <span>Custom Topic Focus (Optional Syllabus Sub-topic keywords)</span>
                        <span className="text-slate-500 font-mono">e.g. Recursion, Logic Gates, HTML Tags</span>
                      </label>
                      <input
                        id="input-ai-topic"
                        type="text"
                        placeholder="Leave empty or click any sub-topic in the right sidebar menu to auto-configure..."
                        value={aiTopic} onChange={(e) => setAiTopic(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-12 pt-2">
                      <button
                        id="btn-ai-generate"
                        type="submit"
                        disabled={aiGenerating}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border border-indigo-500 text-white font-extrabold text-sm rounded-xl tracking-wide shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {aiGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>{aiStatusMessage}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-white animate-pulse" />
                            <span>Generate Interactive Draft Test</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Error status reporting */}
                  {aiError && (
                    <div className="p-4 bg-red-950/70 border border-red-500/30 text-red-105 text-red-200 rounded-xl flex items-start gap-2.5 text-xs" id="status-ai-error">
                      <ShieldAlert className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">AI Generation Exception:</span>
                        <p className="mt-1 text-slate-300 leading-relaxed font-mono">{aiError}</p>
                      </div>
                    </div>
                  )}

                  {/* Generated AI Exam edit & preview drawer */}
                  {aiPreviewExam && (
                    <div className="p-6 bg-slate-950 border border-indigo-500/40 rounded-2xl space-y-6 text-slate-200" id="ai-exam-preview-drawer">
                      <div className="pb-4 border-b border-slate-800 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/30">
                            <CheckCircle className="w-5 h-5 animate-bounce" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white">AI-Draft Composed successfully! Review & Custom-Edit before publishing:</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Reference ID: <strong className="font-mono text-slate-300">{aiPreviewExam.id}</strong> • Highlight and correct any technical question formulations, choices, or answers below.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Interactive Exam Title</label>
                            <input
                              type="text"
                              value={aiPreviewExam.title}
                              onChange={(e) => handleEditPreviewTitle(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Target Class Cohort / Group</label>
                            <select
                              value={aiPreviewExam.classGroup}
                              onChange={(e) => handleEditPreviewClassGroup(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="5-6">Group A (Class 5th - 6th)</option>
                              <option value="7-8">Group B (Class 7th - 8th)</option>
                              <option value="9-10">Group C (Class 9th - 10th)</option>
                              <option value="11-12">Group D (Class 11th - 12th)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Duration Period (Minutes)</label>
                            <input
                              type="number"
                              value={aiPreviewExam.durationMinutes}
                              onChange={(e) => handleEditPreviewDuration(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">Draft Questions Breakdown ({aiPreviewExam.questions.length})</span>
                          <button
                            type="button"
                            onClick={handleAddPreviewQuestionSlot}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-mono inline-flex items-center gap-1.5 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Question Slot
                          </button>
                        </div>

                        {aiPreviewExam.questions.map((q, idx) => (
                          <div key={idx} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 relative text-xs text-slate-200">
                            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                              <span className="font-extrabold text-blue-300 font-mono">Question Item #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => handleDeletePreviewQuestion(idx)}
                                className="px-2 py-1 bg-red-950/80 hover:bg-red-900 text-red-350 text-red-300 border border-red-900/30 rounded text-[10px] font-bold font-mono transition inline-flex items-center gap-1"
                                title="Discard this question block"
                              >
                                <X className="w-3 h-3" />
                                Discard Question
                              </button>
                            </div>

                            <div>
                              <label className="block text-slate-400 font-bold mb-1">Question Statement Body</label>
                              <textarea
                                rows={2}
                                value={q.question}
                                onChange={(e) => handleEditPreviewQuestionText(idx, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="space-y-1">
                                  <label className="block text-[10px] text-slate-400 font-mono font-bold">
                                    <span>Option {String.fromCharCode(65 + oIdx)} {oIdx === q.correctOption ? '• CORRECT CHOICE' : ''}</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleEditPreviewQuestionOption(idx, oIdx, e.target.value)}
                                    className={`w-full bg-slate-950 border p-2.5 rounded-lg text-white text-xs focus:outline-none ${oIdx === q.correctOption ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' : 'border-slate-700'}`}
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="w-64 pt-1">
                              <label className="block text-[10px] text-slate-400 font-bold mb-1">Specify Correct Answer Option Index</label>
                              <select
                                value={q.correctOption}
                                onChange={(e) => handleEditPreviewQuestionCorrectOption(idx, Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-white font-bold font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                              >
                                <option value="0">Option A</option>
                                <option value="1">Option B</option>
                                <option value="2">Option C</option>
                                <option value="3">Option D</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-[11px] text-slate-400 leading-normal max-w-md">
                          Please review all fields, question statements, and correctness mappings above. Clicking publish instantly signs and deploys this olympiad exam to the active Student Portals.
                        </div>
                        <button
                          type="button"
                          onClick={handlePublishAIExam}
                          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border border-emerald-500 text-white font-black text-sm rounded-xl tracking-wide shadow-md flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                          <span>Publish & Show in Student Portal</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Composition of active exams */}
                <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-3">
                  <h4 className="font-bold font-display text-slate-950">Active Mock Exams In System Base ({exams.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {exams.map((ex, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border rounded-xl space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-bold text-blue-600 uppercase tracking-wide">GROUP {ex.classGroup}</span>
                          <span className="text-slate-400 font-mono">{ex.durationMinutes} Minutes</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-display leading-tight">{ex.title}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">Contains: {ex.totalQuestions} questions • Exam Ref: {ex.id}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Syllabus Curriculum Guide Menu */}
              <div className="xl:col-span-4 bg-white p-5 border border-slate-200 rounded-2xl space-y-5 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-105 bg-blue-100 text-blue-800 rounded font-bold font-mono text-[9px] uppercase">
                    <BookOpen className="w-3.5 h-3.5" />
                    Syllabus Guide
                  </div>
                  <h4 className="text-sm font-bold font-display text-slate-900 mt-1.5">Interactive Curriculum Map</h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Click any sub-topic in this official syllabus menu to automatically preconfigure the class cohort group and fill the Custom Topic Focus parameter.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-mono">Select Group Curriculum</label>
                  <select
                    value={selectedAdminSyllabusId}
                    onChange={(e) => setSelectedAdminSyllabusId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-850 rounded-lg p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="5-6 font-semibold text-slate-700">Group A (Class 5th - 6th)</option>
                    <option value="7-8 font-semibold text-slate-700">Group B (Class 7th - 8th)</option>
                    <option value="9-10 font-semibold text-slate-700">Group C (Class 9th - 10th)</option>
                    <option value="11-12 font-semibold text-slate-700">Group D (Class 11th - 12th)</option>
                  </select>
                </div>

                {selectedAdminSyllabusId && OLYMPIAD_SYLLABUS[selectedAdminSyllabusId] && (
                  <div className="space-y-4 pt-1 max-h-[620px] overflow-y-auto pr-1">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-900 leading-normal">
                      <strong className="text-blue-900 block font-bold mb-0.5">{OLYMPIAD_SYLLABUS[selectedAdminSyllabusId].title}</strong>
                      {OLYMPIAD_SYLLABUS[selectedAdminSyllabusId].description}
                    </div>

                    <div className="space-y-3">
                      {OLYMPIAD_SYLLABUS[selectedAdminSyllabusId].modules.map((mod, mIdx) => (
                        <div key={mIdx} className="border border-slate-100 p-3 rounded-xl space-y-2 bg-slate-50/40">
                          <h5 className="font-extrabold text-[11px] uppercase tracking-wide text-slate-400 font-mono border-b pb-1.5">{mod.name}</h5>
                          <div className="space-y-1">
                            {mod.topics.map((topic, tIdx) => (
                              <button
                                key={tIdx}
                                type="button"
                                onClick={() => {
                                  setAiTopic(topic);
                                  setAiGroup(selectedAdminSyllabusId);
                                }}
                                className="w-full text-left p-1.5 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded text-[11px] text-slate-700 font-medium transition flex items-start gap-1 p-1 hover:text-blue-700 cursor-pointer"
                                title="Click to load this syllabus topic focus"
                              >
                                <span className="text-blue-500 font-bold shrink-0 select-none">+</span>
                                <span className="leading-tight text-left">{topic}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: BROADCAST LABELS */}
          {activeTab === 'broadcasting' && (
            <div className="space-y-6">
              
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-950">Release Broadcaster Notifications</h3>
                  <p className="text-xs text-slate-500 mt-1">Transmits instant notice broadsheets to specific coordinate target audiences.</p>
                </div>

                <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="font-bold block">Announcement Headline</label>
                      <input
                        type="text" required placeholder="e.g. Schedule for Mains Stage 2 exam locked in Pune"
                        value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)}
                        className="w-full mt-1 bg-slate-50 border p-2.5 rounded-lg text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="font-bold block">Target Audience Group</label>
                      <select
                        value={noticeAudience} onChange={(e) => setNoticeAudience(e.target.value as any)}
                        className="w-full mt-1 bg-slate-50 border p-2.5 rounded-lg font-bold"
                      >
                        <option value="ALL">Everyone (ALL Users)</option>
                        <option value="SCHOOLS">School Coordinators Only</option>
                        <option value="STUDENTS">Olympiad Students Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block">Body Script Content Details</label>
                    <textarea
                      rows={4} required placeholder="Post coordinates of regional centers or registration date extensions..."
                      value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)}
                      className="w-full mt-1 bg-slate-50 border p-2.5 rounded-lg leading-relaxed text-sm font-light text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1 cursor-pointer transition active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    Transmit Broadcast Announcement
                  </button>
                </form>
              </div>

              {/* Notifications Timeline preview */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold font-display text-slate-950">Active Broadcast Timeline ({announcements.length})</h4>
                <div className="space-y-3">
                  {announcements.map((anc, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Audience: {anc.audience}</span>
                        <span className="text-slate-400 font-mono">{new Date(anc.date).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mt-1 font-display leading-tight">{anc.title}</h4>
                      <p className="text-slate-600 font-light leading-relaxed">{anc.content}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: MANAGING NATIONAL EXAM CENTERS */}
          {activeTab === 'centers' && (
            <div className="space-y-6">
              
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-950">Register National Exam Center Networks</h3>
                  <p className="text-xs text-slate-500 mt-1">Setup geographically secure, certified local computing centers equipped for Stage 2 Mains synchronous tests.</p>
                </div>

                <form onSubmit={handleCreateCenter} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs text-slate-700">
                  <div>
                    <label className="font-bold block mb-1">Center Venue Name</label>
                    <input
                      type="text" required placeholder="e.g. Salt Lake InfoTech Center"
                      value={cenName} onChange={(e) => setCenName(e.target.value)}
                      className="w-full bg-slate-50 border p-2.5 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Regional City Location</label>
                    <input
                      type="text" required placeholder="e.g. Kolkata"
                      value={cenCity} onChange={(e) => setCenCity(e.target.value)}
                      className="w-full bg-slate-50 border p-2.5 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Seating System Capacity Pool</label>
                    <input
                      type="number" required min="50"
                      value={cenCap} onChange={(e) => setCenCap(Number(e.target.value))}
                      className="w-full bg-slate-50 border p-2.5 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition"
                  >
                    Verify & Create Center
                  </button>
                </form>
              </div>

              {/* Exam center directories lists */}
              <div className="bg-white border rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold font-display text-slate-950">Master National Exam Center Directory</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 font-bold text-slate-600 border-b uppercase text-[9px] tracking-wider">
                        <th className="p-3">Proctored Venue Network Name</th>
                        <th className="p-3">City Region</th>
                        <th className="p-3">Seating Capacity Limit</th>
                        <th className="p-3 text-center">Allocated Scholars</th>
                        <th className="p-3">Capacity Gauge Metric</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700 font-medium">
                      {centers.map((cen, idx) => {
                        const usageRatio = Math.round((cen.allocatedStudentsCount / cen.capacity) * 100);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-extrabold text-slate-900 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                              {cen.name}
                            </td>
                            <td className="p-3 font-semibold text-slate-900">{cen.city}</td>
                            <td className="p-3 font-mono font-bold text-slate-500">{cen.capacity} Seats</td>
                            <td className="p-3 text-center font-mono font-bold text-blue-600">{cen.allocatedStudentsCount} Candidates</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                                  <div className="bg-blue-600 h-full" style={{ width: `${Math.min(usageRatio || 1, 100)}%` }} />
                                </div>
                                <span className="font-mono text-[10px] text-slate-400 font-bold">{usageRatio}% filled</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: POSTGRESQL DATABASE & ITEMS MANAGEMENT */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Column 1: Items Manager (8 cols) */}
                <div className="xl:col-span-8 space-y-6">
                  
                  {/* Create New Item Form */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-base font-bold font-display text-slate-950">Add Premium Olympiad Resource</h3>
                      <p className="text-xs text-slate-500 mt-1">Publish a new textbook, solved past papers booklet, or algorithmic study guide to the student portal.</p>
                    </div>

                    <form onSubmit={handleCreateDBItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs text-slate-700">
                      <div className="sm:col-span-2">
                        <label className="font-bold block mb-1">Resource Name</label>
                        <input
                          type="text" required placeholder="e.g. Relational Databases & SQL Solved Guide"
                          value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                          className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium text-slate-900 focus:outline-blue-605 focus:outline-blue-600"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Resource Category</label>
                        <select
                          value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)}
                          className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium text-slate-900 focus:outline-blue-600"
                        >
                          <option value="Study Material">Study Material</option>
                          <option value="Past Paper">Past Paper</option>
                          <option value="Exam Kit">Exam Kit</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold block mb-1">Resource Description</label>
                        <input
                          type="text" required placeholder="Detailed notes covering schema, projections, select queries..."
                          value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)}
                          className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium text-slate-900 focus:outline-blue-600"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Price (INR)</label>
                        <input
                          type="number" required min="0"
                          value={newItemPrice} onChange={(e) => setNewItemPrice(Number(e.target.value))}
                          className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium text-slate-900 focus:outline-blue-600"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <button
                          type="submit"
                          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition active:scale-98"
                        >
                          Verify & Publish Resource
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Registered Items Directory */}
                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-bold font-display text-slate-950">Published Study Resources ({dbItems.length})</h3>
                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 font-bold text-slate-600 border-b uppercase text-[9px] tracking-wider">
                            <th className="p-3">Resource Details</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700 font-medium">
                          {dbItems.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-6 text-center text-slate-500">No resources found in database.</td>
                            </tr>
                          ) : (
                            dbItems.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="p-3 max-w-sm">
                                  <p className="font-extrabold text-slate-900">{item.name}</p>
                                  <p className="text-[10px] text-slate-400 font-normal leading-relaxed mt-0.5">{item.description}</p>
                                </td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded uppercase">
                                    {item.category}
                                  </span>
                                </td>
                                <td className="p-3 font-mono font-bold text-slate-900">
                                  {Number(item.price) === 0 ? 'FREE' : `₹${item.price}`}
                                </td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => item.id && handleDeleteDBItem(item.id)}
                                    className="px-2.5 py-1 text-red-600 hover:text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-[10px] font-bold transition select-none cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Column 2: Database Users Registry (4 cols) */}
                <div className="xl:col-span-4 space-y-6">
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-base font-bold font-display text-slate-950">Database Users Registry</h3>
                      <p className="text-xs text-slate-500 mt-1">Lists all credentials stored in the SQL users table used for auth.</p>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {dbUsers.length === 0 ? (
                        <p className="text-center text-xs text-slate-500 py-6">No users found in database registry.</p>
                      ) : (
                        dbUsers.map((u, i) => (
                          <div key={i} className="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between gap-2 font-sans">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-extrabold text-slate-950 text-xs font-display leading-tight">{u.name}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{u.email}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                u.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-200' :
                                u.role === 'school' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-blue-50 text-blue-750 border border-blue-200'
                              }`}>
                                {u.role}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1.5 border-t border-slate-200/50">
                              <span>SQL User ID: <strong>{u.id}</strong></span>
                              <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: EXAM SCHEDULE DESK */}
          {/* TAB 7: EXAM SCHEDULE DESK */}
          {activeTab === 'schedule' && (
            <div className="space-y-8 max-w-6xl mx-auto animate-fade-in pb-12">
              
              {/* TOP: GLOBAL STAGE 2 MAINS SCHEDULE */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-950">Global Stage 2 (Mains) Schedule</h3>
                    <p className="text-xs text-slate-500 mt-1">Configure official dates, timings, and durations for the global Stage 2 Mains Exam (held at external venues).</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold font-mono tracking-wider text-[10px] rounded-full uppercase">
                    <Calendar className="w-3.5 h-3.5" />
                    Mains Controller
                  </div>
                </div>

                {scheduleSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-pulse" id="schedule-success-alert">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{scheduleSuccess}</span>
                  </div>
                )}

                {scheduleError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2.5 text-xs font-semibold" id="schedule-error-alert">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{scheduleError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSchedule} className="space-y-6 text-xs text-slate-700">
                  <div className="bg-slate-50/60 border border-slate-200 p-5 rounded-2xl space-y-4 max-w-2xl">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <div className="bg-amber-505 bg-amber-500 text-white p-1 rounded-lg">
                        <span className="font-bold px-1 text-[10px]">S2</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm font-display">Stage 2: Main Exam (External Venue)</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold block mb-1">Mains Exam Date</label>
                        <input
                          id="input-main-date"
                          type="text"
                          placeholder="e.g. September 15, 2026"
                          value={schedule.mainExamDate}
                          onChange={(e) => setSchedule(prev => ({ ...prev, mainExamDate: e.target.value }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Exam Start Time</label>
                        <input
                          id="input-main-time"
                          type="text"
                          placeholder="e.g. 10:00 AM"
                          value={schedule.mainExamTime}
                          onChange={(e) => setSchedule(prev => ({ ...prev, mainExamTime: e.target.value }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Duration (Minutes)</label>
                        <input
                          id="input-main-duration"
                          type="number"
                          min="10"
                          placeholder="e.g. 180"
                          value={schedule.mainExamDuration}
                          onChange={(e) => setSchedule(prev => ({ ...prev, mainExamDuration: e.target.value }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 max-w-2xl">
                    <button
                      type="button"
                      id="btn-schedule-clear"
                      onClick={async () => {
                        const cleared = {
                          ...schedule,
                          mainExamDate: '',
                          mainExamTime: '',
                          mainExamDuration: ''
                        };
                        setScheduleSaving(true);
                        setScheduleSuccess('');
                        setScheduleError('');
                        try {
                          const res = await fetch('/api/exam-schedule', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(cleared)
                          });
                          const data = await res.json();
                          if (res.ok && data.status === 'success') {
                            setScheduleSuccess('Stage 2 Mains schedule settings reset/cleared successfully.');
                            setSchedule(data.schedule);
                          } else {
                            setScheduleError('Failed to clear Mains schedule.');
                          }
                        } catch (err: any) {
                          setScheduleError(err.message || 'Error occurred clearing schedule.');
                        } finally {
                          setScheduleSaving(false);
                        }
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border rounded-xl text-slate-700 font-bold tracking-wide transition cursor-pointer select-none"
                    >
                      Clear Mains Schedule Details
                    </button>

                    <button
                      type="submit"
                      id="btn-schedule-save"
                      disabled={scheduleSaving}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border border-indigo-500 text-white font-extrabold text-sm rounded-xl tracking-wide shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {scheduleSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving Timings...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Publish Stage 2 Schedule & Release Admit Cards</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* BOTTOM: SCHOOL PRE-EXAM SCHEDULES LIST & FILTERS */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-950">School Pre-Exam Schedules</h3>
                    <p className="text-xs text-slate-500 mt-1">Manage independent Pre-Exam schedules for each approved school. Students will only see schedules assigned to their registered school.</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-bold font-mono tracking-wider text-[10px] rounded-full uppercase">
                    <Building className="w-3.5 h-3.5" />
                    School-wise Setup
                  </div>
                </div>

                {/* Filters Row */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Filters & Controls</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Search Schools</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search name, ID..."
                          value={scheduleSearchFilter}
                          onChange={(e) => setScheduleSearchFilter(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-slate-950 font-medium outline-none text-xs"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Exam Status</label>
                      <select
                        value={scheduleStatusFilter}
                        onChange={(e) => setScheduleStatusFilter(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-slate-950 font-medium outline-none text-xs"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Not Scheduled">Not Scheduled</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Date Range Start */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Start Date Range</label>
                      <input
                        type="date"
                        value={scheduleStartDateFilter}
                        onChange={(e) => setScheduleStartDateFilter(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-slate-950 font-medium outline-none text-xs"
                      />
                    </div>

                    {/* Date Range End */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">End Date Range</label>
                      <input
                        type="date"
                        value={scheduleEndDateFilter}
                        onChange={(e) => setScheduleEndDateFilter(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-slate-950 font-medium outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setScheduleSearchFilter('');
                        setScheduleStatusFilter('All');
                        setScheduleStartDateFilter('');
                        setScheduleEndDateFilter('');
                      }}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-[10px] transition"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3">School ID & Name</th>
                        <th className="p-3">Pre-Exam Date</th>
                        <th className="p-3">Time & Duration</th>
                        <th className="p-3">Exam Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {filteredSchoolsForScheduling.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">
                            No schools found matching your search or filters.
                          </td>
                        </tr>
                      ) : (
                        filteredSchoolsForScheduling.map((sch) => {
                          const status = getSchoolExamStatus(sch);
                          
                          // Style helper for status badges
                          let statusBadge = (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              Not Scheduled
                            </span>
                          );
                          if (status === 'Upcoming') {
                            statusBadge = (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                Upcoming
                              </span>
                            );
                          } else if (status === 'Active') {
                            statusBadge = (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Active
                              </span>
                            );
                          } else if (status === 'Completed') {
                            statusBadge = (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                Completed
                              </span>
                            );
                          }

                          return (
                            <tr key={sch.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-3">
                                <div className="font-bold text-slate-900">{sch.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{sch.id} | Coordinator: {sch.coordinatorName || 'N/A'}</div>
                              </td>
                              <td className="p-3 font-semibold">
                                {sch.preExamDate ? sch.preExamDate : (
                                  <span className="text-slate-400 italic">Not Scheduled</span>
                                )}
                              </td>
                              <td className="p-3">
                                {sch.preExamDate ? (
                                  <div>
                                    <div className="font-semibold text-slate-900">{sch.preExamTime || 'N/A'}</div>
                                    <div className="text-[10px] text-slate-500">{sch.preExamDuration ? `${sch.preExamDuration} minutes` : 'N/A'}</div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">-</span>
                                )}
                              </td>
                              <td className="p-3">{statusBadge}</td>
                              <td className="p-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleEditScheduleClick(sch)}
                                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 rounded-lg transition"
                                >
                                  Edit Schedule
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODAL FOR SCHEDULING SPECIFIC SCHOOL */}
              {editingSchoolId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                  <div className="bg-white border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold font-display text-base">Edit School Exam Schedule</h4>
                        <p className="text-[10px] text-blue-100 mt-0.5">
                          {schools.find(s => s.id === editingSchoolId)?.name} ({editingSchoolId})
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingSchoolId(null)}
                        className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveSchoolSchedule} className="p-6 space-y-4 text-xs text-slate-700">
                      {editSaveSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-semibold">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{editSaveSuccess}</span>
                        </div>
                      )}

                      {editSaveError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 font-semibold">
                          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                          <span>{editSaveError}</span>
                        </div>
                      )}

                      <div className="space-y-3.5">
                        <div>
                          <label className="font-bold block mb-1">Pre-Exam Date</label>
                          <input
                            type="text"
                            placeholder="e.g. July 28, 2026"
                            required
                            value={editPreExamDate}
                            onChange={(e) => setEditPreExamDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition"
                          />
                          <p className="text-[10px] text-slate-400 mt-0.5">Use formats like "July 28, 2026" or "YYYY-MM-DD" for proper status calculation.</p>
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Exam Start Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 11:00 AM"
                            required
                            value={editPreExamTime}
                            onChange={(e) => setEditPreExamTime(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Duration (Minutes)</label>
                          <input
                            type="number"
                            placeholder="e.g. 120"
                            min="10"
                            required
                            value={editPreExamDuration}
                            onChange={(e) => setEditPreExamDuration(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 font-semibold outline-none transition"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t flex justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setEditingSchoolId(null)}
                          className="px-4 py-2 border rounded-xl font-bold hover:bg-slate-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={editSaving}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {editSaving ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Schedule</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}
          </>
          )}

        </main>
      </div>

    </div>
  );
}
