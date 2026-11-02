import React from 'react';
import { Folder as FolderIcon, ChevronRight, Pencil, Trash2, Dumbbell } from 'lucide-react';
import { Folder } from '../types/exercise';

interface FolderCardProps {
  folder: Folder;
  exerciseCount: number;
  maxWeight?: number;
  onSelect: (folder: Folder) => void;
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  exerciseCount,
  maxWeight,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 shadow-sm flex flex-col justify-between">
      {/* Área clicável principal para abrir a pasta */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(folder)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(folder);
          }
        }}
        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <FolderIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                {folder.name}
              </h3>
              <p className="text-xs text-slate-400">
                {exerciseCount === 0
                  ? 'Nenhum exercício'
                  : exerciseCount === 1
                  ? '1 exercício'
                  : `${exerciseCount} exercícios`}
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all mt-2.5" />
        </div>

        {/* Carga máxima do grupo muscular */}
        {exerciseCount > 0 && typeof maxWeight === 'number' && maxWeight > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-800/60 w-fit mb-2">
            <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
            <span>Carga máx:</span>
            <span className="font-mono font-bold text-white tabular-nums">{maxWeight} kg</span>
          </div>
        )}
      </div>

      {/* Ações da pasta (Editar e Excluir) */}
      <div className="pt-2 mt-1 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">Gerenciar grupo</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(folder);
            }}
            aria-label={`Editar pasta ${folder.name}`}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 active:scale-95 transition-all"
            title="Editar pasta"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder);
            }}
            aria-label={`Excluir pasta ${folder.name}`}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all"
            title="Excluir pasta"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
