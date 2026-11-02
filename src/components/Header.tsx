import React from 'react';
import { Dumbbell, Sun, Moon, ArrowLeft, Folder } from 'lucide-react';

interface HeaderProps {
  currentFolderName?: string | null;
  onBackToFolders?: () => void;
  folderCount: number;
  exerciseCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentFolderName,
  onBackToFolders,
  folderCount,
  exerciseCount,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Lado Esquerdo / Navegação */}
        {currentFolderName ? (
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onBackToFolders}
              aria-label="Voltar para todas as pastas"
              className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 active:scale-95 transition-all shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-amber-400" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="truncate">Pastas</span>
                <span>/</span>
              </div>
              <h1 className="text-base font-bold text-white truncate flex items-center gap-2">
                {currentFolderName}
                <span className="text-xs font-normal text-slate-400">
                  · {exerciseCount} {exerciseCount === 1 ? 'exercício' : 'exercícios'}
                </span>
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                ramosBlk
                <span className="text-xs font-normal text-slate-400">
                  · {folderCount} {folderCount === 1 ? 'grupo' : 'grupos'} ({exerciseCount} {exerciseCount === 1 ? 'exercício' : 'exercícios'})
                </span>
              </h1>
            </div>
          </div>
        )}

        {/* Lado Direito / Ações */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
