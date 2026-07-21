import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Users, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck 
} from 'lucide-react';
import { School } from '../../../types';
import Combobox from '../../ui/Combobox';
import Toast, { ToastMessage } from '../../ui/Toast';
import ChangePasswordCard from '../../ui/ChangePasswordCard';

interface SchoolProfileTabProps {
  school: School;
  fetchSchoolData: () => Promise<void>;
}

export default function SchoolProfileTab({ school, fetchSchoolData }: SchoolProfileTabProps) {
  // Form state initialized from school props
  const [name, setName] = useState(school.name || '');
  const [principalName, setPrincipalName] = useState(school.principalName || '');
  const [coordinatorName, setCoordinatorName] = useState(school.coordinatorName || '');
  const [mobile, setMobile] = useState(school.mobile || '');
  const [address, setAddress] = useState(school.address || '');
  const [city, setCity] = useState(school.city || '');
  const [state, setState] = useState(school.state || 'Delhi');
  const [boardType, setBoardType] = useState(school.boardType || 'CBSE');
  const [totalStudents, setTotalStudents] = useState<number | string>(school.totalStudents || 100);

  // Status & Feedback state
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const indianStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana",
    "Karnataka", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Others"
  ];

  const boardOptions = [
    "CBSE", "ICSE", "State Board", "IB (International Baccalaureate)", "Cambridge (IGCSE)", "Others"
  ];

  // Sync state if school prop updates
  useEffect(() => {
    setName(school.name || '');
    setPrincipalName(school.principalName || '');
    setCoordinatorName(school.coordinatorName || '');
    setMobile(school.mobile || '');
    setAddress(school.address || '');
    setCity(school.city || '');
    setState(school.state || 'Delhi');
    setBoardType(school.boardType || 'CBSE');
    setTotalStudents(school.totalStudents || 100);
  }, [school]);

  const triggerToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToast({ type, title, message });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      const msg = "School full name is required.";
      setErrorMsg(msg);
      triggerToast('error', 'Validation Error', msg);
      return;
    }

    if (!coordinatorName.trim()) {
      const msg = "Coordinator name is required.";
      setErrorMsg(msg);
      triggerToast('error', 'Validation Error', msg);
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/schools/${school.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          principalName: principalName.trim(),
          coordinatorName: coordinatorName.trim(),
          mobile: mobile.trim(),
          address: address.trim(),
          city: city.trim(),
          state,
          boardType,
          totalStudents: Number(totalStudents) || 100
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to update school profile.");
      }

      const successStr = "School profile details updated successfully!";
      setSuccessMsg(successStr);
      triggerToast('success', 'Profile Updated', successStr);
      await fetchSchoolData();
    } catch (err: any) {
      const errStr = err.message || "An error occurred while saving profile changes.";
      setErrorMsg(errStr);
      triggerToast('error', 'Update Failed', errStr);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto relative">
      
      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            <Building className="w-3.5 h-3.5 text-blue-600" />
            Institutional Profile
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2 tracking-tight">
            School Profile & Details
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your school institution profile, principal officer credentials, and coordinator contacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono bg-slate-50 text-slate-600 p-2.5 px-4 rounded-2xl border border-slate-200/80 font-bold">
            School ID: <strong className="text-blue-600 font-extrabold">{school.id}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 p-2.5 px-4 rounded-2xl font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {school.status}
          </span>
        </div>
      </div>

      {/* Inline Feedback Alerts */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3 text-xs font-medium"
        >
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-rose-900">Update Notice:</span>
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

      {/* Main Profile Form Card */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        
        {/* Section 1: Institution Core Details */}
        <div className="space-y-6">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block font-mono border-b border-dashed border-slate-200 pb-2">
            School Institution Information
          </span>

          {/* Row 1: School Name & Board Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Official School Institution Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Delhi Public School"
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Affiliated Education Board Type
              </label>
              <Combobox
                options={boardOptions.map(b => ({ value: b, label: `${b} Board` }))}
                value={boardType}
                onChange={setBoardType}
                placeholder="Select Affiliated Board"
              />
            </div>
          </div>

          {/* Row 2: Email (Immutable) & School ID (Immutable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-700 font-bold flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Coordinator Official Email (Login ID)
                </span>
                <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-extrabold flex items-center gap-1 uppercase">
                  <Lock className="w-3 h-3" />
                  Immutable
                </span>
              </label>
              <input
                type="email"
                disabled
                readOnly
                value={school.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold text-slate-500 cursor-not-allowed select-none opacity-80"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                Official email address is locked for board verification & authentication integrity.
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Assigned Board Registration Code
              </label>
              <input
                type="text"
                disabled
                readOnly
                value={school.id}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold text-blue-600 cursor-not-allowed select-none opacity-80"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                Unique identifier for pre-exam schedule & candidate rosters.
              </p>
            </div>
          </div>

        </div>

        {/* Section 2: Officers & Contact Details */}
        <div className="space-y-6">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block font-mono border-b border-dashed border-slate-200 pb-2">
            Principal & Coordinator Contacts
          </span>

          {/* Row 3: Principal Name & Coordinator Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Principal Officer Name
              </label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                placeholder="e.g. Dr. A. P. Sharma"
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                School Coordinator Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
                placeholder="e.g. Sunita Verma"
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none transition"
              />
            </div>
          </div>

          {/* Row 4: Mobile & Total Students */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Coordinator Direct Mobile (10 Digits)
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

            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Estimated Enrolled Olympiad Candidates Strength
              </label>
              <input
                type="number"
                min={1}
                value={totalStudents}
                onChange={(e) => setTotalStudents(e.target.value)}
                placeholder="e.g. 150"
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none transition"
              />
            </div>
          </div>

        </div>

        {/* Section 3: Address & Location */}
        <div className="space-y-6">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block font-mono border-b border-dashed border-slate-200 pb-2">
            Campus Address & Regional Location
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Campus Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Sector 12, Main Institutional Area"
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-700 font-bold block mb-1">
                State / Territory Region
              </label>
              <Combobox
                options={indianStates.map(st => ({ value: st, label: st }))}
                value={state}
                onChange={setState}
                placeholder="Select State"
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
          </button>
        </div>

      </form>

      {/* Security & Password Update Section */}
      <ChangePasswordCard role="school" email={school.email} />

    </div>
  );
}
