import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, KeyRound, Home } from 'lucide-react';

interface ResetPasswordPageProps {
  onNavigateHome: () => void;
  onOpenLogin: (role: 'student' | 'school' | 'admin') => void;
}

export default function ResetPasswordPage({ onNavigateHome, onOpenLogin }: ResetPasswordPageProps) {
  const [token, setToken] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenEmail, setTokenEmail] = useState<string | null>(null);
  const [tokenRole, setTokenRole] = useState<'student' | 'school' | 'admin' | null>(null);

  // Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password Visibility Eye Icon Toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenParam = searchParams.get('token');
    setToken(tokenParam);

    if (!tokenParam) {
      setVerifying(false);
      setTokenValid(false);
      setError("No reset token provided in link URL.");
      return;
    }

    // Verify reset token validity with backend
    fetch('/api/auth/verify-reset-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenParam })
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setTokenValid(true);
          setTokenEmail(data.email);
          setTokenRole(data.role);
        } else {
          setTokenValid(false);
          setError(data.error || "Password reset link is invalid or has expired.");
        }
      })
      .catch(err => {
        setTokenValid(false);
        setError("Failed to verify reset token. Please ensure your connection is active.");
      })
      .finally(() => {
        setVerifying(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please ensure both fields match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred while resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative font-sans text-slate-800">
      
      {/* Ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Brand Bar */}
      <div className="mb-8 text-center space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-lg">
          <img src="/logo.png?v=3" alt="Enfinite Logo" className="h-6 w-auto object-contain" />
          <span>Enfinite National Olympiad</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
          Password Reset Portal
        </h1>
      </div>

      {/* Main Container Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative z-10 space-y-6"
      >
        {/* Loading Verification State */}
        {verifying && (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Verifying Security Token...
            </p>
          </div>
        )}

        {/* Token Invalid / Expired State */}
        {!verifying && !tokenValid && !resetSuccess && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold font-display text-slate-900">
                Invalid or Expired Link
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {error || "This password reset link is invalid or has expired. Password reset links are valid for 60 minutes."}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onNavigateHome}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Reset State */}
        {resetSuccess && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold font-display text-slate-900">
                Password Reset Completed!
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Your password for <strong>{tokenEmail}</strong> has been updated successfully. You can now log in with your new credentials.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenLogin(tokenRole || 'student')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Active Reset Password Form */}
        {!verifying && tokenValid && !resetSuccess && (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="text-center space-y-1 pb-2 border-b border-slate-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-blue-100">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Set New Password
              </h3>
              {tokenEmail && (
                <p className="text-xs text-slate-500 font-medium">
                  Resetting credentials for <strong className="text-slate-800">{tokenEmail}</strong> ({tokenRole})
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Field 1: New Password with Eye Toggle Icon */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 pl-9 pr-10 text-sm font-semibold text-slate-800 outline-none transition"
                />
                {/* Eye Icon Password Visibility Toggle Button */}
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

            {/* Field 2: Confirm New Password with Eye Toggle Icon */}
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 pl-9 pr-10 text-sm font-semibold text-slate-800 outline-none transition"
                />
                {/* Eye Icon Password Visibility Toggle Button */}
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 transition cursor-pointer flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? "Updating Password..." : "Update Password"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </motion.div>

      <div className="mt-8 text-center text-[11px] text-slate-400 font-medium relative z-10">
        &copy; 2026 Enfinite National Olympiad Board. All rights reserved.
      </div>
    </div>
  );
}
