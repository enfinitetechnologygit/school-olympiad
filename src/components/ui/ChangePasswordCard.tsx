import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Lock, ShieldCheck, Eye, EyeOff, Save, CheckCircle2, AlertTriangle } from 'lucide-react';
import Toast, { ToastMessage } from './Toast';

interface ChangePasswordCardProps {
  role: 'student' | 'school' | 'admin';
  email: string;
}

export default function ChangePasswordCard({ role, email }: ChangePasswordCardProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility eye icon toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & toast state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const triggerToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToast({ type, title, message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword) {
      const msg = "Current password is required.";
      setErrorMsg(msg);
      triggerToast('error', 'Validation Error', msg);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      const msg = "New password must be at least 6 characters long.";
      setErrorMsg(msg);
      triggerToast('error', 'Validation Error', msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = "New password and confirm password do not match.";
      setErrorMsg(msg);
      triggerToast('error', 'Validation Error', msg);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          email,
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to update password.");
      }

      const successStr = "Your portal password has been updated successfully!";
      setSuccessMsg(successStr);
      triggerToast('success', 'Password Updated', successStr);

      // Reset form input values on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const errStr = err.message || "An error occurred while updating password.";
      setErrorMsg(errStr);
      triggerToast('error', 'Update Failed', errStr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 relative font-sans">
      
      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-dashed border-slate-200 pb-4">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900">
            Security & Change Password
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Update your account password for secure portal access.
          </p>
        </div>
      </div>

      {/* Inline Feedback Banners */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2.5 text-xs font-semibold"
        >
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Password Change Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Field 1: Current Password */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Current Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showCurrentPassword ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 pl-9 pr-10 text-sm font-semibold text-slate-800 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
              title={showCurrentPassword ? "Hide password" : "Show password"}
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Field 2: New Password */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            New Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 pl-9 pr-10 text-sm font-semibold text-slate-800 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
              title={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Field 3: Confirm New Password */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Confirm New Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password to confirm"
              className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 pl-9 pr-10 text-sm font-semibold text-slate-800 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Updating..." : "Update Password"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
