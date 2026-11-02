import React from 'react';
import { AlertTriangle, FolderX } from 'lucide-react';
import { Folder, Exercise } from '../types/exercise';

interface ConfirmDeleteFolderModalProps {
  isOpen: boolean;
  folder: Folder | null;
  exercisesInFolder: Exercise[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteFolderModal: React.FC<ConfirmDeleteFolderModalProps> = ({
  isOpen,
  folder,
  exercisesInFolder,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !folder) return null;

  const count = exercisesInFolder.length;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-folder-dialog-title"
      aria-describedby="delete-folder-dialog-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
          <FolderX className="w-6 h-6" />
        </div>

        <h3 id="delete-folder-dialog-title" className="text-lg font-bold text-white mb-2">
          Excluir Pasta "{folder.name}"?
        </h3>

        <div id="delete-folder-dialog-description" className="space-y-3 mb-6 text-sm text-slate-300 text-left">
          {count > 0 ? (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-200">
                    Atenção: Esta pasta contém {count} {count === 1 ? 'exercício cadastrado' : 'exercícios cadastrados'}:
                  </p>
                  <ul className="mt-1.5 list-disc list-inside text-xs text-rose-300/90 space-y-0.5 max-h-24 overflow-y-auto">
                    {exercisesInFolder.map((ex) => (
                      <li key={ex.id} className="truncate">
                        {ex.name} ({ex.weight} kg)
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs font-bold text-rose-300">
                    Ao excluir esta pasta, todos os {count} exercícios e suas cargas vinculadas serão excluídos permanentemente.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-center">
              Esta pasta está vazia (não contém nenhum exercício). Deseja removê-la permanentemente?
            </p>
          )}
        </div>

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
            {count > 0 ? `Excluir Pasta e ${count} ${count === 1 ? 'Item' : 'Itens'}` : 'Sim, Excluir Pasta'}
          </button>
        </div>
      </div>
    </div>
  );
};
