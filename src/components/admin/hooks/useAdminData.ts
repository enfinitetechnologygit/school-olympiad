import React, { useState, useEffect } from 'react';
import { School, Student, MockExam, Announcement, ExamCenter, DBUser, DBItem, ExamSchedule } from '../../../types';

export function useAdminData() {
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<MockExam[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [centers, setCenters] = useState<ExamCenter[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedSchoolProfile, setSelectedSchoolProfile] = useState<School | null>(null);
  
  const [activeTab, setActiveTab] = useState<'approvals' | 'students' | 'exams' | 'broadcasting' | 'centers' | 'database' | 'schedule' | 'security'>('approvals');
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

  // Header Announcement State
  const [headerAnnouncementText, setHeaderAnnouncementText] = useState('');
  const [savingHeaderAnnouncement, setSavingHeaderAnnouncement] = useState(false);
  const [headerAnnouncementSuccess, setHeaderAnnouncementSuccess] = useState('');

  // Slider Images State
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [newSliderImageUrl, setNewSliderImageUrl] = useState('');
  const [savingSliderImage, setSavingSliderImage] = useState(false);
  const [sliderSuccess, setSliderSuccess] = useState('');

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

      // Fetch header announcement
      try {
        const haRes = await fetch('/api/announcements/header');
        if (haRes.ok) {
          const haData = await haRes.json();
          setHeaderAnnouncementText(haData.text || '');
        }
      } catch (err) {
        console.error("Error fetching header announcement:", err);
      }

      // Fetch slider images
      try {
        const slRes = await fetch('/api/settings/slider');
        if (slRes.ok) {
          const slData = await slRes.json();
          setSliderImages(slData || []);
        }
      } catch (err) {
        console.error("Error fetching slider images:", err);
      }

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

  const handleSaveHeaderAnnouncement = async (text: string) => {
    setSavingHeaderAnnouncement(true);
    setHeaderAnnouncementSuccess('');
    try {
      const response = await fetch('/api/announcements/header', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (response.ok) {
        setHeaderAnnouncementSuccess("Header announcement updated successfully!");
        setHeaderAnnouncementText(text);
        setTimeout(() => setHeaderAnnouncementSuccess(''), 3000);
      } else {
        alert("Failed to save header announcement.");
      }
    } catch (err) {
      alert("Error saving header announcement");
    } finally {
      setSavingHeaderAnnouncement(false);
    }
  };

  const handleDeleteHeaderAnnouncement = async () => {
    if (!confirm("Are you sure you want to delete the header announcement? This will remove the announcement bar from the home page.")) return;
    setSavingHeaderAnnouncement(true);
    setHeaderAnnouncementSuccess('');
    try {
      const response = await fetch('/api/announcements/header', {
        method: 'DELETE'
      });
      if (response.ok) {
        setHeaderAnnouncementSuccess("Header announcement deleted/removed successfully!");
        setHeaderAnnouncementText('');
        setTimeout(() => setHeaderAnnouncementSuccess(''), 3000);
      } else {
        alert("Failed to delete header announcement.");
      }
    } catch (err) {
      alert("Error deleting header announcement");
    } finally {
      setSavingHeaderAnnouncement(false);
    }
  };

  const handleSaveSliderImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSliderImageUrl || !newSliderImageUrl.trim()) return;

    setSavingSliderImage(true);
    setSliderSuccess('');
    try {
      const response = await fetch('/api/settings/slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newSliderImageUrl })
      });
      if (response.ok) {
        const data = await response.json();
        setSliderSuccess("Slider image added successfully!");
        setSliderImages(data.images || []);
        setNewSliderImageUrl('');
        setTimeout(() => setSliderSuccess(''), 3000);
      } else {
        alert("Failed to add slider image.");
      }
    } catch (err) {
      alert("Error adding slider image.");
    } finally {
      setSavingSliderImage(false);
    }
  };

  const handleUploadSliderImage = async (file: File) => {
    if (!file) return;

    setSavingSliderImage(true);
    setSliderSuccess('');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const response = await fetch('/api/settings/slider/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              base64Data
            })
          });

          if (response.ok) {
            const data = await response.json();
            setSliderSuccess("Image uploaded successfully!");
            setSliderImages(data.images || []);
            setTimeout(() => setSliderSuccess(''), 3000);
          } else {
            const errData = await response.json();
            alert("Failed to upload image: " + (errData.error || "Server error"));
          }
        } catch (err: any) {
          alert("Error sending upload payload: " + err.message);
        }
      };
      reader.onerror = () => {
        alert("Failed to read the image file.");
      };
    } catch (err: any) {
      alert("Error reading file: " + err.message);
    } finally {
      setSavingSliderImage(false);
    }
  };

  const handleDeleteSliderImage = async (url: string) => {
    if (!confirm("Are you sure you want to delete this slider image?")) return;
    setSavingSliderImage(true);
    setSliderSuccess('');
    try {
      const response = await fetch('/api/settings/slider', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (response.ok) {
        const data = await response.json();
        setSliderSuccess("Slider image deleted successfully!");
        setSliderImages(data.images || []);
        setTimeout(() => setSliderSuccess(''), 3000);
      } else {
        alert("Failed to delete slider image.");
      }
    } catch (err) {
      alert("Error deleting slider image.");
    } finally {
      setSavingSliderImage(false);
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

  const handleEditScheduleClick = (school: School) => {
    setEditingSchoolId(school.id);
    let dateVal = school.preExamDate || '';
    if (dateVal && !/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
      const parsed = Date.parse(dateVal);
      if (!isNaN(parsed)) {
        const d = new Date(parsed);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        dateVal = `${d.getFullYear()}-${month}-${day}`;
      }
    }
    setEditPreExamDate(dateVal);
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

  return {
    schools,
    setSchools,
    students,
    setStudents,
    exams,
    setExams,
    announcements,
    setAnnouncements,
    centers,
    setCenters,
    stats,
    setStats,
    selectedSchoolProfile,
    setSelectedSchoolProfile,
    activeTab,
    setActiveTab,
    dbItems,
    setDbItems,
    dbUsers,
    setDbUsers,
    schedule,
    setSchedule,
    scheduleSuccess,
    setScheduleSuccess,
    scheduleError,
    setScheduleError,
    scheduleSaving,
    setScheduleSaving,
    scheduleStatusFilter,
    setScheduleStatusFilter,
    scheduleStartDateFilter,
    setScheduleStartDateFilter,
    scheduleEndDateFilter,
    setScheduleEndDateFilter,
    scheduleSearchFilter,
    setScheduleSearchFilter,
    editingSchoolId,
    setEditingSchoolId,
    editPreExamDate,
    setEditPreExamDate,
    editPreExamTime,
    setEditPreExamTime,
    editPreExamDuration,
    setEditPreExamDuration,
    editSaveError,
    setEditSaveError,
    editSaveSuccess,
    setEditSaveSuccess,
    editSaving,
    setEditSaving,
    newItemName,
    setNewItemName,
    newItemDesc,
    setNewItemDesc,
    newItemPrice,
    setNewItemPrice,
    newItemCategory,
    setNewItemCategory,
    selectedAdminSyllabusId,
    setSelectedAdminSyllabusId,
    loading,
    setLoading,
    passingMarksEdit,
    setPassingMarksEdit,
    savingPassingMarks,
    setSavingPassingMarks,
    passingMarksSuccess,
    setPassingMarksSuccess,
    passingMarksError,
    setPassingMarksError,
    schoolSearch,
    setSchoolSearch,
    studentSearch,
    setStudentSearch,
    schoolRosterSearch,
    setSchoolRosterSearch,
    schoolRosterClassFilter,
    setSchoolRosterClassFilter,
    aiGroup,
    setAiGroup,
    aiDifficulty,
    setAiDifficulty,
    aiTopic,
    setAiTopic,
    aiCount,
    setAiCount,
    aiDuration,
    setAiDuration,
    aiGenerating,
    setAiGenerating,
    aiStatusMessage,
    setAiStatusMessage,
    aiPreviewExam,
    setAiPreviewExam,
    aiError,
    setAiError,
    noticeTitle,
    setNoticeTitle,
    noticeContent,
    setNoticeContent,
    noticeAudience,
    setNoticeAudience,
    cenName,
    setCenName,
    cenCity,
    setCenCity,
    cenCap,
    setCenCap,
    isBulkUploadOpen,
    setIsBulkUploadOpen,
    bulkInputText,
    setBulkInputText,
    bulkStatusMessage,
    setBulkStatusMessage,
    fetchAdminData,
    handleSaveSchedule,
    handleApproveSchool,
    handleRejectSchool,
    handleDeleteSchool,
    handleApproveCandidatePayment,
    handleManualQualify,
    handleStage1Release,
    handleStage2Release,
    handleAllocateCenter,
    handleUpdateScore,
    handleSavePassingMarks,
    handleBulkUploadResultsSubmit,
    handleEditPreviewTitle,
    handleEditPreviewDuration,
    handleEditPreviewClassGroup,
    handleEditPreviewQuestionText,
    handleEditPreviewQuestionOption,
    handleEditPreviewQuestionCorrectOption,
    handleDeletePreviewQuestion,
    handleAddPreviewQuestionSlot,
    handlePublishAIExam,
    handleAIGenerateExam,
    handleCreateAnnouncement,
    handleCreateCenter,
    handleCreateDBItem,
    handleDeleteDBItem,
    getSchoolExamStatus,
    handleEditScheduleClick,
    handleSaveSchoolSchedule,
    headerAnnouncementText,
    setHeaderAnnouncementText,
    savingHeaderAnnouncement,
    headerAnnouncementSuccess,
    handleSaveHeaderAnnouncement,
    handleDeleteHeaderAnnouncement,
    sliderImages,
    setSliderImages,
    newSliderImageUrl,
    setNewSliderImageUrl,
    savingSliderImage,
    sliderSuccess,
    handleSaveSliderImage,
    handleDeleteSliderImage,
    handleUploadSliderImage
  };
}
