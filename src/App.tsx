import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import AuthModals from './components/AuthModals';
import StudentDashboard from './components/StudentDashboard';
import SchoolDashboard from './components/SchoolDashboard';
import AdminDashboard from './components/AdminDashboard';
import { School } from './types';

export default function App() {
  const [schools, setSchools] = useState<School[]>([]);
  const [userRole, setUserRole] = useState<'student' | 'school' | 'admin' | null>(null);
  const [userSession, setUserSession] = useState<any | null>(null);

  // Modal configuration
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister' | null>(null);

  const fetchSchoolsList = async () => {
    try {
      const response = await fetch('/api/schools');
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        setSchools(data);
      } else {
        console.warn("Schools API returned non-JSON/invalid response, using empty fallback");
        setSchools([]);
      }
    } catch (e) {
      console.error("Error reading school array checklist detail", e);
      setSchools([]);
    }
  };

  useEffect(() => {
    fetchSchoolsList();
  }, []);

  const handleOpenModal = (type: 'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const handleLoginSuccess = (role: string, userData: any) => {
    setUserRole(role as any);
    setUserSession(userData);
    handleCloseModal();
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserSession(null);
    fetchSchoolsList();
  };

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans text-slate-800">
      
      {/* Role Router Page Mapping */}
      {userRole === null && (
        <HomeView 
          onOpenModal={handleOpenModal} 
          schools={schools} 
        />
      )}

      {userRole === 'student' && userSession && (
        <StudentDashboard 
          user={userSession} 
          onLogout={handleLogout} 
        />
      )}

      {userRole === 'school' && userSession && (
        <SchoolDashboard 
          user={userSession} 
          onLogout={handleLogout} 
        />
      )}

      {userRole === 'admin' && userSession && (
        <AdminDashboard 
          user={userSession} 
          onLogout={handleLogout} 
        />
      )}

      {/* Unified Security Authentication and Registration Popups */}
      <AuthModals 
        isOpen={isModalOpen} 
        type={modalType} 
        onClose={handleCloseModal} 
        schools={schools} 
        onLoginSuccess={handleLoginSuccess}
        onRefreshSchools={fetchSchoolsList}
      />

    </div>
  );
}
