import React, { useState, useEffect } from 'react';
import { School, Student, Announcement } from '../../../types';

interface UseSchoolDataProps {
  user: any;
  onLogout: () => void;
}

export function useSchoolData({ user, onLogout }: UseSchoolDataProps) {
  const [school, setSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<'roster' | 'qualifiers' | 'analytics' | 'notices' | 'schedule' | 'profile'>('roster');
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

  return {
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
  };
}
