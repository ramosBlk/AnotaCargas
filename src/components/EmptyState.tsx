import React from 'react';
import { Dumbbell, FolderPlus, Plus, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  type?: 'folders' | 'exercises';
  onActionClick: () => void;
  isSearching?: boolean;
  folderName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'exercises',
  onActionClick,
  isSearching = false,
  folderName,
}) => {
  const isFolders = type === 'folders';

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
        {isFolders ? <FolderOpen className="w-8 h-8 text-amber-500/60" /> : <Dumbbell className="w-8 h-8 text-amber-500/60" />}
      </div>

      <h3 className="text-base font-bold text-white mb-1">
        {isSearching
          ? 'Nenhum resultado encontrado'
          : isFolders
          ? 'Nenhum grupo muscular cadastrado'
          : `Nenhum exercício em "${folderName || 'esta pasta'}"`}
      </h3>

      <p className="text-sm text-slate-400 max-w-xs mb-6">
        {isSearching
          ? 'Tente buscar por outro termo ou limpe o campo de busca.'
          : isFolders
          ? 'Crie grupos musculares (ex: Peito, Costas, Pernas) para organizar seus treinos e cargas.'
          : 'Adicione os exercícios e as cargas utilizadas neste grupo muscular para acompanhar seu progresso.'}
      </p>

      {!isSearching && (
        <button
          type="button"
          onClick={onActionClick}
          className="min-h-[48px] px-5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          {isFolders ? (
            <>
              <FolderPlus className="w-4 h-4 stroke-[2.5]" />
              Criar Primeiro Grupo
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Adicionar Exercício
            </>
          )}
        </button>
      )}
    </div>
  );
};
