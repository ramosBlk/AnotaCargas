import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { Exercise, Folder } from '../types/exercise';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, weight: number, folderId: string) => void;
  exerciseToEdit?: Exercise | null;
  folders: Folder[];
  defaultFolderId?: string;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  exerciseToEdit,
  folders,
  defaultFolderId,
}) => {
  const [name, setName] = useState('');
  const [weightStr, setWeightStr] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [folderError, setFolderError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (exerciseToEdit) {
        setName(exerciseToEdit.name);
        setWeightStr(exerciseToEdit.weight.toString());
        setSelectedFolderId(exerciseToEdit.folderId);
      } else {
        setName('');
        setWeightStr('');
        setSelectedFolderId(defaultFolderId || (folders[0]?.id ?? ''));
      }
      setNameError(null);
      setWeightError(null);
      setFolderError(null);

      setTimeout(() => {
        if (exerciseToEdit) {
          weightInputRef.current?.focus();
        } else {
          nameInputRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, exerciseToEdit, defaultFolderId, folders]);

  if (!isOpen) return null;

  // Ajuste rápido de carga (+1, +2.5, +5, etc)
  const handleQuickAdjust = (delta: number) => {
    const current = parseFloat(weightStr.replace(',', '.')) || 0;
    const updated = Math.max(0.5, Math.round((current + delta) * 10) / 10);
    setWeightStr(updated.toString());
    if (weightError) setWeightError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const trimmedName = name.trim();

    // Validação do nome
    if (!trimmedName) {
      setNameError('Informe o nome do exercício.');
      hasError = true;
    } else {
      setNameError(null);
    }

    // Validação da carga
    const sanitizedWeightStr = weightStr.trim().replace(',', '.');
    const parsedWeight = parseFloat(sanitizedWeightStr);

    if (!weightStr.trim()) {
      setWeightError('Informe a carga utilizada.');
      hasError = true;
    } else if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setWeightError('A carga deve ser um valor numérico maior que zero.');
      hasError = true;
    } else {
      setWeightError(null);
    }

    // Validação da pasta (regra principal: cada exercício deve estar vinculado a uma pasta)
    if (!selectedFolderId) {
      setFolderError('Selecione um grupo muscular / pasta para o exercício.');
      hasError = true;
    } else {
      setFolderError(null);
    }

    if (hasError) return;

    onSave(trimmedName, parsedWeight, selectedFolderId);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl transition-all">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 id="modal-title" className="text-lg font-bold text-white">
            {exerciseToEdit ? 'Editar Exercício' : 'Cadastrar Exercício'}
          </h2>
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
          {/* Seleção de Pasta / Grupo Muscular */}
          <div>
            <label htmlFor="exercise-folder" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Pasta (Grupo Muscular) <span className="text-rose-400">*</span>
            </label>
            <select
              id="exercise-folder"
              value={selectedFolderId}
              onChange={(e) => {
                setSelectedFolderId(e.target.value);
                if (folderError) setFolderError(null);
              }}
              className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                folderError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-amber-500'
              } text-white text-sm focus:outline-none transition-colors`}
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                  📁 {f.name}
                </option>
              ))}
            </select>
            {folderError && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">
                {folderError}
              </p>
            )}
          </div>

          {/* Campo Nome */}
          <div>
            <label htmlFor="exercise-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nome do Exercício <span className="text-rose-400">*</span>
            </label>
            <input
              id="exercise-name"
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Ex.: Supino Reto, Agachamento..."
              className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                nameError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-amber-500'
              } text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
            />
            {nameError && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">
                {nameError}
              </p>
            )}
          </div>

          {/* Campo Carga */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="exercise-weight" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Carga Utilizada (kg) <span className="text-rose-400">*</span>
              </label>
              <span className="text-xs text-slate-400">Aceita decimais (ex.: 12.5)</span>
            </div>

            <div className="relative">
              <input
                id="exercise-weight"
                ref={weightInputRef}
                type="text"
                inputMode="decimal"
                value={weightStr}
                onChange={(e) => {
                  setWeightStr(e.target.value);
                  if (weightError) setWeightError(null);
                }}
                placeholder="0.0"
                className={`w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border ${
                  weightError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-amber-500'
                } text-white font-mono text-base focus:outline-none transition-colors tabular-nums`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm pointer-events-none">
                kg
              </span>
            </div>
            {weightError && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">
                {weightError}
              </p>
            )}

            {/* Ajustes rápidos */}
            <div className="mt-3 flex items-center justify-between gap-1 overflow-x-auto py-1">
              <span className="text-xs text-slate-500 shrink-0 mr-1 font-medium">Ajuste rápido:</span>
              <div className="flex items-center gap-1.5">
                {[-5, -2.5, -1, 1, 2.5, 5].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => handleQuickAdjust(delta)}
                    className="min-h-[36px] px-2.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono font-medium hover:bg-slate-700 active:scale-95 transition-all"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
              {exerciseToEdit ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
