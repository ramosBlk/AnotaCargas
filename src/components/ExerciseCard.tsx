import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Exercise } from '../types/exercise';
import { formatWeight } from '../services/storage';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Informações do Exercício */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-100 truncate" title={exercise.name}>
            {exercise.name}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-amber-400 tabular-nums">
              {formatWeight(exercise.weight)}
            </span>
          </div>
        </div>

        {/* Ações (Editar e Excluir) com alvos de toque >= 44px */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(exercise)}
            aria-label={`Editar ${exercise.name}`}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 active:scale-95 transition-all"
            title="Editar exercício"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(exercise)}
            aria-label={`Excluir ${exercise.name}`}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all"
            title="Excluir exercício"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
