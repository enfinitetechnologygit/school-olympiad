import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import AuthModals from './components/AuthModals';
import StudentDashboard from './components/StudentDashboard';
import SchoolDashboard from './components/SchoolDashboard';
import AdminDashboard from './components/AdminDashboard';
import { School } from './types';
import { Info, CheckCircle2, ShieldAlert } from 'lucide-react';

import ResetPasswordPage from './components/ResetPasswordPage';

export default function App() {
  const [schools, setSchools] = useState<School[]>([]);
  const [userRole, setUserRole] = useState<'student' | 'school' | 'admin' | null>(null);
  const [userSession, setUserSession] = useState<any | null>(null);
  const [isResetPasswordPage, setIsResetPasswordPage] = useState(false);

  // Check URL route for password reset link
  useEffect(() => {
    const checkResetRoute = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path === '/reset-password' || search.includes('token=')) {
        setIsResetPasswordPage(true);
      } else {
        setIsResetPasswordPage(false);
      }
    };
    checkResetRoute();
    window.addEventListener('popstate', checkResetRoute);
    return () => window.removeEventListener('popstate', checkResetRoute);
  }, []);

  // Dynamic SEO Title Updates
  useEffect(() => {
    if (isResetPasswordPage) {
      document.title = "Reset Password | Enfinite National Olympiad (ENO)";
    } else if (userRole === 'student') {
      document.title = `${userSession?.name || 'Student Candidate'} | Student Portal - ENO`;
    } else if (userRole === 'school') {
      document.title = `${userSession?.name || 'School'} | School Coordinator Portal - ENO`;
    } else if (userRole === 'admin') {
      document.title = "Head Office Control Terminal | Enfinite National Olympiad Board";
    } else {
      document.title = "Enfinite National Olympiad (ENO) | India's Premier CS & IT Olympiad Board";
    }
  }, [isResetPasswordPage, userRole, userSession]);

  // Modal configuration
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister' | null>(null);

  // Custom Alert Modal state
  const [customAlert, setCustomAlert] = useState<{ message: string; isOpen: boolean }>({ message: '', isOpen: false });

  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message: any) => {
      setCustomAlert({ message: String(message), isOpen: true });
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const getAlertStyle = (msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes('error') || lower.includes('failed') || lower.includes('invalid') || lower.includes('deny') || lower.includes('rejected')) {
      return {
        icon: 'error',
        bgColor: 'bg-red-50',
        textColor: 'text-red-500',
        btnColor: 'bg-red-600 hover:bg-red-700',
        title: 'Action Failed'
      };
    }
    if (lower.includes('success') || lower.includes('approved') || lower.includes('unlocked') || lower.includes('synced')) {
      return {
        icon: 'success',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-500',
        btnColor: 'bg-emerald-600 hover:bg-emerald-700',
        title: 'Task Successful'
      };
    }
    return {
      icon: 'info',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-500',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      title: 'System Notification'
    };
  };

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

  // Restore session from localStorage and handle initial URL routing
  useEffect(() => {
    const restoreSession = () => {
      const stored = localStorage.getItem('eno_auth_session');
      if (stored) {
        try {
          const sessionData = JSON.parse(stored);
          const ageInMs = Date.now() - sessionData.timestamp;
          const twoHoursInMs = 2 * 60 * 60 * 1000;

          if (ageInMs < twoHoursInMs) {
            setUserRole(sessionData.role);
            setUserSession(sessionData.user);

            // Align URL with the role
            if (sessionData.role === 'student') window.history.replaceState({}, '', '/student');
            else if (sessionData.role === 'school') window.history.replaceState({}, '', '/school');
            else if (sessionData.role === 'admin') window.history.replaceState({}, '', '/admin');
            return;
          } else {
            localStorage.removeItem('eno_auth_session');
          }
        } catch (e) {
          console.error("Error restoring session:", e);
          localStorage.removeItem('eno_auth_session');
        }
      }

      // If no valid session but current URL is a dashboard route, redirect to homepage
      const path = window.location.pathname;
      if (path === '/student' || path === '/school' || path === '/admin') {
        window.history.replaceState({}, '', '/');
      }
    };

    restoreSession();
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const stored = localStorage.getItem('eno_auth_session');

      if (stored) {
        try {
          const session = JSON.parse(stored);
          const ageInMs = Date.now() - session.timestamp;
          const twoHoursInMs = 2 * 60 * 60 * 1000;

          if (ageInMs < twoHoursInMs && path === `/${session.role}`) {
            setUserRole(session.role);
            setUserSession(session.user);
            return;
          }
        } catch (e) {}
      }

      // Go back to home if user navigates to root or has no session
      if (path === '/') {
        setUserRole(null);
        setUserSession(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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

    // Save session in localStorage with current timestamp
    const sessionData = {
      role,
      user: userData,
      timestamp: Date.now()
    };
    localStorage.setItem('eno_auth_session', JSON.stringify(sessionData));

    // Update URL in browser history
    if (role === 'student') window.history.pushState({}, '', '/student');
    else if (role === 'school') window.history.pushState({}, '', '/school');
    else if (role === 'admin') window.history.pushState({}, '', '/admin');

    handleCloseModal();
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserSession(null);
    localStorage.removeItem('eno_auth_session');
    window.history.pushState({}, '', '/');
    fetchSchoolsList();
  };

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans text-slate-800">
      
      {/* Password Reset Page or Portal Views */}
      {isResetPasswordPage ? (
        <ResetPasswordPage
          onNavigateHome={() => {
            window.history.pushState({}, '', '/');
            setIsResetPasswordPage(false);
          }}
          onOpenLogin={(role) => {
            window.history.pushState({}, '', '/');
            setIsResetPasswordPage(false);
            handleOpenModal(role === 'student' ? 'studentLogin' : role === 'school' ? 'schoolLogin' : 'adminLogin');
          }}
        />
      ) : (
        <>
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
        </>
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

      {/* Global Custom Alert Dialog */}
      {customAlert.isOpen && (() => {
        const style = getAlertStyle(customAlert.message);
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 text-center transform scale-100 transition-all duration-300 space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full ${style.bgColor} flex items-center justify-center ${style.textColor} transition`}>
                {style.icon === 'success' && <CheckCircle2 className="w-8 h-8 animate-bounce" />}
                {style.icon === 'error' && <ShieldAlert className="w-8 h-8 animate-pulse" />}
                {style.icon === 'info' && <Info className="w-8 h-8 animate-pulse" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">{style.title}</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed px-2">{customAlert.message}</p>
              </div>
              <button
                onClick={() => setCustomAlert({ message: '', isOpen: false })}
                className={`w-full py-3 ${style.btnColor} text-white font-bold text-xs tracking-wider rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition focus:outline-none`}
              >
                DISMISS
              </button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
