import React, { useState, useEffect, useRef } from 'react';
import { X, Check, FolderPlus, Folder } from 'lucide-react';
import { Folder as FolderType } from '../types/exercise';
import { DEFAULT_SUGGESTED_GROUPS } from '../services/storage';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  folderToEdit?: FolderType | null;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  folderToEdit,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(folderToEdit ? folderToEdit.name : '');
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, folderToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Informe o nome do grupo muscular ou pasta.');
      return;
    }

    onSave(trimmed);
    onClose();
  };

  const handleSelectSuggestion = (suggested: string) => {
    setName(suggested);
    if (error) setError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="folder-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl transition-all">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              {folderToEdit ? <Folder className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
            </div>
            <h2 id="folder-modal-title" className="text-lg font-bold text-white">
              {folderToEdit ? 'Editar Grupo Muscular' : 'Nova Pasta (Grupo Muscular)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="folder-name-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nome da Pasta / Grupo <span className="text-rose-400">*</span>
            </label>
            <input
              id="folder-name-input"
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex.: Peito, Costas, Posterior, Push..."
              className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-amber-500'
              } text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
            />
            {error && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">
                {error}
              </p>
            )}
          </div>

          {/* Sugestões rápidas de grupos musculares */}
          {!folderToEdit && (
            <div>
              <span className="block text-xs text-slate-400 mb-2">
                Sugestões rápidas (ou digite seu grupo personalizado):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_SUGGESTED_GROUPS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSelectSuggestion(sug)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      name.toLowerCase() === sug.toLowerCase()
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="pt-4 flex items-center gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[48px] px-4 rounded-xl border border-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-800 active:scale-98 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[48px] px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              {folderToEdit ? 'Salvar Nome' : 'Criar Pasta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
