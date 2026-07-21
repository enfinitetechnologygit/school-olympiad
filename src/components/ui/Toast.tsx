import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id?: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ toast, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, duration, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-6 right-6 z-50 max-w-md w-full sm:w-auto min-w-[320px] pointer-events-auto"
        >
          <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-start gap-3 justify-between ${
            toast.type === 'success'
              ? 'bg-slate-900/95 text-white border-emerald-500/40 shadow-emerald-950/40'
              : toast.type === 'error'
              ? 'bg-slate-900/95 text-white border-rose-500/40 shadow-rose-950/40'
              : 'bg-slate-900/95 text-white border-blue-500/40 shadow-blue-950/40'
          }`}>
            <div className="flex items-start gap-3">
              {toast.type === 'success' && (
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-xl shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-xl shrink-0 mt-0.5">
                  <Info className="w-5 h-5" />
                </div>
              )}

              <div className="space-y-0.5 text-left">
                {toast.title && (
                  <h4 className={`text-xs font-black uppercase tracking-wider ${
                    toast.type === 'success' ? 'text-emerald-400' : toast.type === 'error' ? 'text-rose-400' : 'text-blue-400'
                  }`}>
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {toast.message}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer shrink-0"
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
