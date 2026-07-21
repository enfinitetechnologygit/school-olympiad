import React, { useState } from 'react';
import {
  X,
  School as SchoolIcon,
  User,
  Lock,
  MapPin,
  Mail,
  Phone,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Building,
  CreditCard,
  CreditCard as PaymentIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { School } from '../types';
import Combobox from './ui/Combobox';
import DatePicker from './ui/DatePicker';

interface AuthModalsProps {
  isOpen: boolean;
  type: 'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister' | null;
  onClose: () => void;
  schools: School[];
  onLoginSuccess: (role: string, userData: any) => void;
  onRefreshSchools: () => void;
}

export default function AuthModals({
  isOpen,
  type,
  onClose,
  schools,
  onLoginSuccess,
  onRefreshSchools
}: AuthModalsProps) {

  if (!isOpen || !type) return null;

  const [modalView, setModalView] = useState<'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister' | 'studentPayment' | 'studentSuccess' | 'forgotPassword'>(type);

  React.useEffect(() => {
    if (type) {
      setModalView(type);
      setError(null);
      setSuccess(null);
      if (type.includes('Login')) {
        setActiveLoginRole(type === 'studentLogin' ? 'student' : type === 'schoolLogin' ? 'school' : 'admin');
      }
    }
  }, [type]);

  // Tabs management for unified login
  const [activeLoginRole, setActiveLoginRole] = useState<'student' | 'school' | 'admin'>(
    type === 'studentLogin' ? 'student' : type === 'schoolLogin' ? 'school' : 'admin'
  );

  // General Notification feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if ((error || success) && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error, success]);

  // --- Login Form State ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- School Register Form State ---
  const [schoolName, setSchoolName] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [schoolMobile, setSchoolMobile] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [schoolState, setSchoolState] = useState('Delhi');
  const [schoolBoard, setSchoolBoard] = useState('CBSE');
  const [schoolStudentsCount, setSchoolStudentsCount] = useState<number>(100);

  // --- Student Register Form State ---
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('Class 5');
  const [studentGender, setStudentGender] = useState('Male');
  const [studentDob, setStudentDob] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [studentParentName, setStudentParentName] = useState('');
  const [studentParentMobile, setStudentParentMobile] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentSchoolId, setStudentSchoolId] = useState('');

  // Mock Payment UI State after successful student submit
  const [showPaymentReceipt, setShowPaymentReceipt] = useState(false);
  const [registeredStudentSnapshot, setRegisteredStudentSnapshot] = useState<any | null>(null);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const indianStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana",
    "Karnataka", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
  ];

  const approvedSchools = schools.filter(s => s.status === 'APPROVED');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: activeLoginRole,
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error("Received non-JSON response from server. The server might be down or misconfigured.");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onLoginSuccess(activeLoginRole, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: schoolName,
          principalName,
          coordinatorName,
          mobile: schoolMobile,
          email: schoolEmail,
          address: schoolAddress,
          city: schoolCity,
          state: schoolState,
          boardType: schoolBoard,
          totalStudents: Number(schoolStudentsCount),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSuccess(`Success! Your School Registration has been submitted for approval. You will receive your School ID and login credentials at ${schoolEmail} once approved by the administrator.`);
      onRefreshSchools();

      // Clear forms
      setSchoolName('');
      setPrincipalName('');
      setCoordinatorName('');
      setSchoolMobile('');
      setSchoolEmail('');
      setSchoolAddress('');
      setSchoolCity('');

      // Auto-close success modal after 5 seconds
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!studentSchoolId) {
      setError("Please select a registered school. If not available, choose a nearby registered school as center guide.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentName,
          classLevel: studentClass,
          gender: studentGender,
          dob: studentDob,
          mobile: studentMobile,
          parentName: studentParentName,
          parentMobile: "",
          email: studentEmail,
          schoolId: studentSchoolId
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit details.");
      }

      setRegisteredStudentSnapshot(data.student);
      setModalView('studentPayment');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock Razorpay payment completion trigger
  const handleCompleteRazorpayPayment = async () => {
    if (!registeredStudentSnapshot) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/students/${registeredStudentSnapshot.id}/pay`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment transaction processing failed.");
      }

      setRegisteredStudentSnapshot(data.student);
      setPaymentDone(true);
      setModalView('studentSuccess');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: activeLoginRole,
          email: loginEmail
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccess(data.message || "A new password has been successfully sent to your email!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-bold font-display">
              {modalView.includes('Login') && "ACCESS SECURITY PORTAL"}
              {modalView === 'schoolRegister' && "SCHOOL ENROLLMENT DIRECTORY REQUEST"}
              {modalView === 'studentRegister' && "NATIONAL CS OLYMPIAD STUDENT ENROLLMENT"}
              {modalView === 'studentPayment' && "REGISTRATION FEE PAYMENT"}
              {modalView === 'studentSuccess' && "REGISTRATION SUCCESSFUL!"}
              {modalView === 'forgotPassword' && "RESET ACCOUNT PASSWORD"}
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Enfinite National IT & Computer Science Olympiad Board
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-sm font-semibold cursor-pointer"
          >
            <X className="w-5 h-5 inline-block" />
          </button>
        </div>

        {/* Modal Inner Container */}
        <div ref={containerRef} className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-xs font-semibold flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border-1 border-emerald-200 text-emerald-800 rounded-lg text-xs flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{success}</span>
              </div>

              {registeredStudentSnapshot && paymentDone && (
                <div className="mt-3 p-4 bg-white border border-emerald-100 rounded-xl space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Olympiad Fee Receipt Proof</span>
                    <span className="text-emerald-600 font-extrabold text-xs">PAID SUCCESSFULLY</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400">Student Name:</span>
                      <p className="font-bold text-slate-900">{registeredStudentSnapshot.name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Enrollment ID:</span>
                      <p className="font-mono font-bold text-blue-600">{registeredStudentSnapshot.id}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Class Block:</span>
                      <p className="font-bold text-slate-900">{registeredStudentSnapshot.classLevel}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Payment Ref ID:</span>
                      <p className="font-mono font-medium text-slate-700 text-[11px]">{registeredStudentSnapshot.paymentId}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Allocated Center ID:</span>
                      <p className="font-bold text-slate-900 uppercase">CEN-3001 (New Delhi HQ Tech)</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Amount Charged:</span>
                      <p className="font-bold text-slate-900">₹200.00 inclusive of tax</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Authorized: Enfinite Scholastics Desk</span>
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Print Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* UTILITY TABS for Unified Login */}
          {modalView.includes('Login') && !success && (
            <div>
              <div className="flex border border-slate-100 rounded-xl overflow-hidden mb-6 bg-slate-50 p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => { setActiveLoginRole('student'); setError(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeLoginRole === 'student'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Student Portal Login
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveLoginRole('school'); setError(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeLoginRole === 'school'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  School Portal Login
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveLoginRole('admin'); setError(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeLoginRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Head Office Admin
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                    {activeLoginRole === 'student' && "Registered Student Email Address"}
                    {activeLoginRole === 'school' && "School Coordinator Email"}
                    {activeLoginRole === 'admin' && "National Admin Username / Email"}
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder={
                        activeLoginRole === 'student' ? "rohan@eno.org" :
                          activeLoginRole === 'school' ? "dpsrkp@edu.in" : "admin@eno.org"
                      }
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3 pl-10 text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Secure Access Pin / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setModalView('forgotPassword');
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-500 font-bold hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3 pl-10 pr-10 text-sm outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide rounded-xl shadow-md cursor-pointer disabled:opacity-50 transition"
                >
                  {loading ? "Decrypting coordinates..." : "AUTHENTICATE PORTAL ACCESS"}
                </button>

                {activeLoginRole === 'school' && (
                  <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100 mt-4">
                    Coordinating a new school?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setModalView('schoolRegister');
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Register your school
                    </button>
                  </div>
                )}

                {activeLoginRole === 'student' && (
                  <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100 mt-4">
                    New student?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setModalView('studentRegister');
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Register Student
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {modalView === 'forgotPassword' && !success && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-100 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Enter your email address below. We will generate a new secure password and send it to your email inbox.</span>
              </div>

              {/* UTILITY TABS for Forgot Password Role */}
              <div className="flex border border-slate-100 rounded-xl overflow-hidden bg-slate-50 p-1 shrink-0">
                {(['student', 'school', 'admin'] as const).map((roleVal) => (
                  <button
                    key={roleVal}
                    type="button"
                    onClick={() => { setActiveLoginRole(roleVal); setError(null); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeLoginRole === roleVal
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    {roleVal === 'student' && "Student"}
                    {roleVal === 'school' && "School Coordinator"}
                    {roleVal === 'admin' && "Head Office Admin"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your registered email address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3 pl-10 text-sm outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide rounded-xl shadow-md cursor-pointer disabled:opacity-50 transition"
                >
                  {loading ? "Verifying identity & resetting..." : "RESET & SEND NEW PASSWORD"}
                </button>

                <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100 mt-4">
                  Remembered password?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setModalView(activeLoginRole === 'student' ? 'studentLogin' : activeLoginRole === 'school' ? 'schoolLogin' : 'adminLogin');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Back to login
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SCHOOL REGISTER FORM */}
          {modalView === 'schoolRegister' && !success && (
            <form onSubmit={handleSchoolRegisterSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Submit school parameters to register your institution and immediately receive your School ID & password.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 font-bold">School Name</label>
                  <input
                    type="text" required placeholder="e.g. Greenwood High School"
                    value={schoolName} onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold">Principal Full Name</label>
                  <input
                    type="text" required placeholder="e.g. Dr. Seema Sapru"
                    value={principalName} onChange={(e) => setPrincipalName(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 font-bold">Olympiad Coordinator (Staff Designation)</label>
                  <input
                    type="text" required placeholder="e.g. HOD Computer Science Department"
                    value={coordinatorName} onChange={(e) => setCoordinatorName(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold">School Contact Mobile No.</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    minLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    value={schoolMobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setSchoolMobile(val);
                    }}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold">Coordinator Email Address</label>
                <input
                  type="email" required placeholder="e.g. cs.coordinator@greenwood.edu"
                  value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold">Address Details</label>
                <input
                  type="text" required placeholder="Street Location & Landmark"
                  value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-600 font-bold">City Location</label>
                  <input
                    type="text" required placeholder="e.g. Pune"
                    value={schoolCity} onChange={(e) => setSchoolCity(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold">State Province</label>
                  <Combobox
                    options={indianStates.map((st) => ({ value: st, label: st }))}
                    value={schoolState}
                    onChange={setSchoolState}
                    placeholder="Choose State..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold">Board Type</label>
                  <Combobox
                    options={[
                      { value: "CBSE", label: "CBSE Board" },
                      { value: "ICSE", label: "CISCE / ICSE Board" },
                      { value: "State Board", label: "State Secondary Board" },
                      { value: "IB", label: "IB International Board" },
                      { value: "Other", label: "Other Affiliated Board" }
                    ]}
                    value={schoolBoard}
                    onChange={setSchoolBoard}
                    placeholder="Choose Board..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold">Estimated Olympiad Enrollment Pool Count</label>
                <input
                  type="number" required min="10"
                  value={schoolStudentsCount} onChange={(e) => setSchoolStudentsCount(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl cursor-pointer shadow transition"
              >
                {loading ? "Transmitting parameter payload..." : "REGISTER INSTITUTION WITH BOARD"}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100 mt-4">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setModalView('schoolLogin');
                    setActiveLoginRole('school');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}

          {/* STUDENT REGISTER FORM */}
          {modalView === 'studentRegister' && !success && (
            <form onSubmit={handleStudentRegisterSubmit} className="space-y-4">

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-100 text-xs flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-bold">Required Olympiad Entry Fee: ₹200.00</p>
                    <p className="text-[10px] text-slate-500">Auto receipts, admit tracking cards, and quiz grids unlock post checkout.</p>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-extrabold uppercase">SECURE ENTRY LOOP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 font-bold">Student Full Name</label>
                  <input
                    type="text" required placeholder="e.g. Sneha Nair"
                    value={studentName} onChange={(e) => setStudentName(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold">Class Level Selection (Class 5th - 12th)</label>
                  <Combobox
                    options={["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((cl) => ({
                      value: cl,
                      label: `${cl}th Division (Computer Science Group)`
                    }))}
                    value={studentClass}
                    onChange={setStudentClass}
                    placeholder="Select Class..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs text-slate-600 font-bold">Gender</label>
                  <Combobox
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" }
                    ]}
                    value={studentGender}
                    onChange={setStudentGender}
                    placeholder="Gender..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-600 font-bold">Date of Birth</label>
                  <DatePicker
                    value={studentDob}
                    onChange={setStudentDob}
                    placeholder="Select Birth Date"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs text-slate-600 font-bold">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    minLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile"
                    value={studentMobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setStudentMobile(val);
                    }}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold">Parent / Guardian Full Name</label>
                <input
                  type="text" required placeholder="Father or Mother"
                  value={studentParentName} onChange={(e) => setStudentParentName(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold">Email Address ID (Login Username)</label>
                <input
                  type="email" required placeholder="e.g. loginstudent@example.com"
                  value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                />
              </div>

              {/* School election mechanism */}
              <div>
                <label className="text-xs text-slate-900 font-bold flex items-center gap-1">
                  <Building className="w-4 h-4 text-slate-600" />
                  Link Registered School Group
                </label>
                <Combobox
                  options={approvedSchools.map((sch) => ({
                    value: sch.id,
                    label: `${sch.name} (${sch.city}, ${sch.state})`
                  }))}
                  value={studentSchoolId}
                  onChange={setStudentSchoolId}
                  placeholder="-- Choose Registered National School (Search/Select) --"
                  required
                  className="mt-1"
                />
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] text-slate-500 mt-2 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <p>
                    <strong>School Availability Note:</strong> If your school is not yet listed, they are likely in PENDING administrative review. You can select any nearby approved registered school to act as your Pre-Exam local proctoring center.
                  </p>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base tracking-wide rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-2"
              >
                Register Now
              </button>
            </form>
          )}

          {/* STUDENT PAYMENT VIEW (THE PAYMENT PAGE) */}
          {modalView === 'studentPayment' && registeredStudentSnapshot && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-4 flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Olympiad Registration Fee Details</h4>
                  <p className="text-[11px] text-slate-600">Please review your registration parameters and complete the required payment below.</p>
                </div>
              </div>

              {/* Invoice breakdown card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="pb-3 border-b border-dashed border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Registration Invoice ID</span>
                  <span className="font-mono text-xs font-bold text-blue-600">INV-{registeredStudentSnapshot.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Student Name</span>
                    <p className="font-bold text-slate-800">{registeredStudentSnapshot.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Contact Email</span>
                    <p className="font-mono font-bold text-slate-800">{registeredStudentSnapshot.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Class Block</span>
                    <p className="font-bold text-slate-800">{registeredStudentSnapshot.classLevel} (Computer Science Division)</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Proctoring School</span>
                    <p className="font-bold text-slate-800 text-[11px]">{registeredStudentSnapshot.schoolName}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Olympiad Registry Entry Charge:</span>
                    <span>₹200.00</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Syllabus Prep Handbook & Mock Grids:</span>
                    <span className="text-emerald-600">FREE / INCLUDED</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Transaction Processing Charges:</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Total Amount Payable:</span>
                    <span className="text-blue-600 text-base font-bold">₹200.00</span>
                  </div>
                </div>
              </div>

              {/* Simulated payment action panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <PaymentIcon className="w-4 h-4 text-blue-600" />
                  Select Payment Option (Mock Gateway)
                </h4>

                <div className="grid grid-cols-3 gap-2.5">
                  <button type="button" className="p-3 border-2 border-blue-600 bg-blue-50/50 rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-pointer">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-[10px] font-bold text-blue-900">Cards</span>
                  </button>
                  <button type="button" disabled className="p-3 border border-slate-200 bg-slate-50 opacity-60 rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-not-allowed">
                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                    <span className="text-[10px] font-bold text-slate-500">UPI/GPay</span>
                  </button>
                  <button type="button" disabled className="p-3 border border-slate-200 bg-slate-50 opacity-60 rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-not-allowed">
                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                    <span className="text-[10px] font-bold text-slate-500">Net Banking</span>
                  </button>
                </div>

                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/55 space-y-3">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Mock Visa / Master Card Input</div>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" disabled value="4111 2222 3333 4444" className="col-span-3 bg-white border border-slate-200 rounded-lg p-2 font-mono text-xs text-slate-500" />
                    <input type="text" disabled value="12/29" className="bg-white border border-slate-200 rounded-lg p-2 font-mono text-xs text-slate-500 text-center" />
                    <input type="password" disabled value="123" className="bg-white border border-slate-200 rounded-lg p-2 font-mono text-xs text-slate-500 text-center" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteRazorpayPayment}
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "Processing Payment Gateway..." : "Pay ₹200 Now"}
                </button>
              </div>
            </div>
          )}

          {/* STUDENT SUCCESS VIEW (WELCOME SCREEN) */}
          {modalView === 'studentSuccess' && registeredStudentSnapshot && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-display text-slate-900">Registration Successful!</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Welcome to the Enfinite National Olympiad. Your payment has been received, and your candidate profile is fully activated.
                </p>
              </div>

              {/* Receipt detail card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 max-w-md mx-auto text-left">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider pb-2 border-b border-dashed border-slate-200">
                  Payment Receipt Summary
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Student Name:</span>
                    <span className="font-bold text-slate-800">{registeredStudentSnapshot.name}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Registered Email:</span>
                    <span className="font-mono font-bold text-slate-800">{registeredStudentSnapshot.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-dashed border-slate-200 pt-2 font-semibold text-slate-700">
                    <span>Payment Receipt Status:</span>
                    <span className="text-emerald-600 font-bold">₹200.00 PAID</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl text-xs max-w-md mx-auto leading-relaxed flex gap-2 text-left">
                <Info className="w-4.5 h-4.5 shrink-0 text-blue-600 mt-0.5" />
                <p>
                  An automatic welcome credentials email has been sent to your email address: <strong className="font-mono">{registeredStudentSnapshot.email}</strong>. Please check your inbox for exam schedules and admit download links.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Print Payment Receipt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess('student', {
                      role: 'student',
                      id: registeredStudentSnapshot.id,
                      email: registeredStudentSnapshot.email,
                      name: registeredStudentSnapshot.name,
                      details: registeredStudentSnapshot
                    });
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
                >
                  Access Student Portal
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
