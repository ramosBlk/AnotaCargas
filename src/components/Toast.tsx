import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types/exercise';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
      <div
        className={`flex items-center justify-between p-3.5 rounded-xl border shadow-lg backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100'
            : isError
            ? 'bg-rose-950/95 border-rose-500/40 text-rose-100'
            : 'bg-slate-900/95 border-slate-700/60 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
          <span className="text-sm font-medium leading-snug">{toast.text}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar notificação"
          className="min-h-[44px] min-w-[44px] -my-2 -mr-2 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
