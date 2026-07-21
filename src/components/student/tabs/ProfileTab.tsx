import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Lock, 
  Building, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  UserCheck 
} from 'lucide-react';
import { Student, School } from '../../../types';
import Combobox from '../../ui/Combobox';
import DatePicker from '../../ui/DatePicker';
import Toast, { ToastMessage } from '../../ui/Toast';
import ChangePasswordCard from '../../ui/ChangePasswordCard';

interface ProfileTabProps {
  student: Student;
  fetchDashboardData: () => Promise<void>;
}

export default function ProfileTab({ student, fetchDashboardData }: ProfileTabProps) {
  // Form state initialized with student props
  const [name, setName] = useState(student.name || '');
  const [classLevel, setClassLevel] = useState(student.classLevel || 'Class 5');
  const [gender, setGender] = useState(student.gender || 'Male');
  const [dob, setDob] = useState(student.dob || '');
  const [mobile, setMobile] = useState(student.mobile || '');
  const [parentName, setParentName] = useState(student.parentName || '');
  const [schoolId, setSchoolId] = useState(student.schoolId || '');
  const [photoUrl, setPhotoUrl] = useState(student.photo || '');

  // Aux state for schools dropdown and status feedback
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Floating Toast notification state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToast({ type, title, message });
  };

  // Sync state if student prop changes
  useEffect(() => {
    setName(student.name || '');
    setClassLevel(student.classLevel || 'Class 5');
    setGender(student.gender || 'Male');
    setDob(student.dob || '');
    setMobile(student.mobile || '');
    setParentName(student.parentName || '');
    setSchoolId(student.schoolId || '');
    setPhotoUrl(student.photo || '');
  }, [student]);

  // Fetch approved schools for school selection combobox
  useEffect(() => {
    setLoadingSchools(true);
    fetch('/api/schools')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const approved = data.filter((s: School) => s.status === 'APPROVED');
          setSchools(approved);
        }
      })
      .catch(err => console.error("Error fetching schools list:", err.message))
      .finally(() => setLoadingSchools(false));
  }, []);

  // Handle Photo File Select & Upload (JPEG / PNG, Max 100KB)
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate File Format (JPEG or PNG only)
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const hasValidExt = /\.(jpg|jpeg|png)$/i.test(file.name);

    if (!validTypes.includes(file.type.toLowerCase()) && !hasValidExt) {
      const msg = "Invalid photo format. Only JPEG (.jpg, .jpeg) and PNG (.png) images are permitted.";
      setErrorMsg(msg);
      triggerToast('error', 'Photo Upload Error', msg);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Validate File Size (Max 100KB)
    const MAX_SIZE_BYTES = 100 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const sizeKb = (file.size / 1024).toFixed(1);
      const msg = `Photo size (${sizeKb}KB) exceeds maximum limit of 100KB. Please compress or select a smaller image.`;
      setErrorMsg(msg);
      triggerToast('error', 'File Size Exceeded', msg);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read file as Base64 Data URL and upload immediately to /public/uploads
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setUploadingPhoto(true);

      try {
        const response = await fetch(`/api/students/${student.id}/photo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photoBase64: base64Data,
            fileName: file.name,
            mimeType: file.type || (file.name.endsWith('.png') ? 'image/png' : 'image/jpeg')
          })
        });

        const data = await response.json();
        if (!response.ok || data.error) {
          throw new Error(data.error || "Failed to upload photo.");
        }

        setPhotoUrl(data.photoUrl);
        const successStr = "Profile photo uploaded and saved successfully!";
        setSuccessMsg(successStr);
        triggerToast('success', 'Photo Uploaded', successStr);
        await fetchDashboardData();
      } catch (err: any) {
        const errStr = err.message || "Failed to upload profile photo.";
        setErrorMsg(errStr);
        triggerToast('error', 'Upload Failed', errStr);
      } finally {
        setUploadingPhoto(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Form Submit for Profile Updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      const reqMsg = "Student full name is required.";
      setErrorMsg(reqMsg);
      triggerToast('error', 'Validation Error', reqMsg);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          classLevel,
          gender,
          dob,
          mobile: mobile.trim(),
          parentName: parentName.trim(),
          schoolId,
          photo: photoUrl
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to update profile.");
      }

      const successStr = "Student profile details updated successfully!";
      setSuccessMsg(successStr);
      triggerToast('success', 'Profile Updated', successStr);
      await fetchDashboardData();
    } catch (err: any) {
      const errStr = err.message || "An error occurred while updating profile.";
      setErrorMsg(errStr);
      triggerToast('error', 'Update Failed', errStr);
    } finally {
      setSaving(false);
    }
  };

  const firstInitial = name ? name.trim().charAt(0).toUpperCase() : 'S';

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto relative">
      
      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Profile Management
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2 tracking-tight">
            Candidate Profile & Credentials
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Review and update your personal details, class level, and profile photo.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 text-slate-600 p-2.5 px-4 rounded-2xl border border-slate-200/80 font-bold">
          <span>Student ID:</span>
          <span className="text-blue-600 font-extrabold">{student.id}</span>
        </div>
      </div>

      {/* Alert Messages Banners */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3 text-xs font-medium"
        >
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-rose-900">Upload / Update Notice:</span>
            <p>{errorMsg}</p>
          </div>
        </motion.div>
      )}

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-start gap-3 text-xs font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-emerald-900">Changes Saved:</span>
            <p>{successMsg}</p>
          </div>
        </motion.div>
      )}

      {/* Main Profile Workspace Card */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        
        {/* Profile Photo Uploader Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          
          {/* Avatar / Photo Display */}
          <div className="relative group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-4xl shadow-lg shadow-blue-500/20 border-2 border-white relative">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt={name} 
                  className="w-full h-full object-cover"
                  onError={() => setPhotoUrl('')}
                />
              ) : (
                <span>{firstInitial}</span>
              )}

              {uploadingPhoto && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider">
                  Uploading...
                </div>
              )}
            </div>

            {/* Quick Upload Icon Button Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-2 -right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md border-2 border-white cursor-pointer transition active:scale-95"
              title="Upload Photo (JPEG/PNG, Max 100KB)"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Requirements Description */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-base font-bold text-slate-900 font-display">Student Profile Picture</h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">Public Directory</span>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed max-w-md font-medium">
              Upload a clear frontal photograph for identification on your Stage 1 and Stage 2 Admit Cards.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[10px]">
              <span className="bg-blue-50 border border-blue-200 text-blue-700 font-extrabold px-2.5 py-1 rounded-full uppercase">
                Formats: JPEG, PNG
              </span>
              <span className="bg-amber-50 border border-amber-200 text-amber-800 font-extrabold px-2.5 py-1 rounded-full uppercase">
                Max Size: 100 KB
              </span>
            </div>

            {/* Hidden File Input */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/jpeg,image/png,.jpg,.jpeg,.png"
              onChange={handlePhotoSelect}
              className="hidden" 
            />

            <div className="pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Select & Upload Photo</span>
              </button>
            </div>
          </div>

        </div>

        {/* Form Inputs Grid */}
        <div className="space-y-6">
          
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block font-mono border-b border-dashed border-slate-200 pb-2">
            Personal & Academic Information
          </span>

          {/* Row 1: Email (Read-Only) & Student ID (Read-Only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-700 font-bold flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address ID (Login Username)
                </span>
                <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-extrabold flex items-center gap-1 uppercase">
                  <Lock className="w-3 h-3" />
                  Immutable
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  readOnly
                  value={student.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold text-slate-500 cursor-not-allowed select-none opacity-80"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                Email address is locked for security & login authorization verification.
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold flex items-center gap-1.5 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                Assigned Olympiad Record ID
              </label>
              <input
                type="text"
                disabled
                readOnly
                value={student.id}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold text-blue-600 cursor-not-allowed select-none opacity-80"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                Official registration code for pre-exam center rosters.
              </p>
            </div>
          </div>

          {/* Row 2: Student Name & Parent Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Candidate Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pankaj Sharma"
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Parent / Guardian Full Name
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none transition"
              />
            </div>
          </div>

          {/* Row 3: Class Level & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Class Cohort Level (Class 5th - 12th)
              </label>
              <Combobox
                options={["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((cl) => ({
                  value: cl,
                  label: `${cl}th Division (Computer Science Group)`
                }))}
                value={classLevel}
                onChange={setClassLevel}
                placeholder="Select Class Level"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Gender Selection
              </label>
              <Combobox
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" }
                ]}
                value={gender}
                onChange={setGender}
                placeholder="Select Gender"
              />
            </div>
          </div>

          {/* Row 4: Date of Birth & Mobile Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Date of Birth
              </label>
              <DatePicker
                value={dob}
                onChange={setDob}
                placeholder="Select Birth Date"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Mobile Contact Number (10 Digits)
              </label>
              <input
                type="tel"
                maxLength={10}
                minLength={10}
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setMobile(val);
                }}
                placeholder="10-digit mobile number"
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none transition"
              />
            </div>
          </div>

          {/* Row 5: Linked Registered School */}
          <div>
            <label className="text-xs text-slate-700 font-bold flex items-center gap-1.5 mb-1">
              <Building className="w-4 h-4 text-slate-500" />
              Linked Registered School Group
            </label>
            <Combobox
              options={schools.map((s) => ({
                value: s.id,
                label: `${s.name} (${s.city}, ${s.state})`
              }))}
              value={schoolId}
              onChange={setSchoolId}
              placeholder="Choose Enrolled Registered School..."
            />
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Updating your registered school coordinates dynamically updates your pre-exam offline test venue.
            </p>
          </div>

        </div>

        {/* Save Action Footer */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Updates..." : "Save Profile Changes"}</span>
          </button>
        </div>

      </form>

      {/* Security & Password Update Section */}
      <ChangePasswordCard role="student" email={student.email} />

    </div>
  );
}
