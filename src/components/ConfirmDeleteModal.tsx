import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Exercise } from '../types/exercise';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  exercise: Exercise | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  exercise,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !exercise) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 id="delete-dialog-title" className="text-lg font-bold text-white mb-2">
          Excluir Exercício?
        </h3>

        <p id="delete-dialog-description" className="text-sm text-slate-300 leading-relaxed mb-6">
          Tem certeza de que deseja excluir <span className="font-semibold text-white">"{exercise.name}"</span>?
          Essa ação removerá o registro permanentemente.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[48px] px-4 rounded-xl border border-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-800 active:scale-98 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 min-h-[48px] px-4 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-500 active:scale-98 transition-all shadow-lg shadow-rose-600/20"
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
};
