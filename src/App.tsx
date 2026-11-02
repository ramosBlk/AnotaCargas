/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  FolderPlus,
  Trophy,
  Activity,
  X,
  Folder as FolderIcon,
  Layers,
} from 'lucide-react';
import { Folder, Exercise, ToastMessage } from './types/exercise';
import {
  getSavedFolders,
  saveFoldersToStorage,
  getSavedExercises,
  saveExercisesToStorage,
  formatWeight,
} from './services/storage';
import { Header } from './components/Header';
import { FolderCard } from './components/FolderCard';
import { ExerciseCard } from './components/ExerciseCard';
import { FolderModal } from './components/FolderModal';
import { ExerciseModal } from './components/ExerciseModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { ConfirmDeleteFolderModal } from './components/ConfirmDeleteFolderModal';
import { Toast } from './components/Toast';
import { EmptyState } from './components/EmptyState';

export default function App() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Estados de busca
  const [searchQuery, setSearchQuery] = useState('');

  // Modais de Pasta
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  // Modais de Exercício
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);

  // Notificações e Tema
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isDark, setIsDark] = useState(true);

  // Carregar dados salvos no início
  useEffect(() => {
    const loadedFolders = getSavedFolders();
    const loadedExercises = getSavedExercises();
    setFolders(loadedFolders);
    setExercises(loadedExercises);

    const savedTheme = localStorage.getItem('@ironload:theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('@ironload:theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('@ironload:theme', 'light');
      }
      return next;
    });
  };

  const showToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  };

  // Pasta ativa atual
  const currentFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    return folders.find((f) => f.id === selectedFolderId) || null;
  }, [folders, selectedFolderId]);

  // Exercícios da pasta ativa
  const exercisesInCurrentFolder = useMemo(() => {
    if (!selectedFolderId) return [];
    return exercises.filter((ex) => ex.folderId === selectedFolderId);
  }, [exercises, selectedFolderId]);

  // Filtragem na tela atual
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    const q = searchQuery.toLowerCase().trim();
    return folders.filter((f) => f.name.toLowerCase().includes(q));
  }, [folders, searchQuery]);

  const filteredExercisesInFolder = useMemo(() => {
    if (!searchQuery.trim()) return exercisesInCurrentFolder;
    const q = searchQuery.toLowerCase().trim();
    return exercisesInCurrentFolder.filter((ex) => ex.name.toLowerCase().includes(q));
  }, [exercisesInCurrentFolder, searchQuery]);

  // Mapeamento de contagem de exercícios e carga máxima por pasta
  const folderStatsMap = useMemo(() => {
    const stats: Record<string, { count: number; maxWeight: number }> = {};
    for (const f of folders) {
      stats[f.id] = { count: 0, maxWeight: 0 };
    }
    for (const ex of exercises) {
      if (stats[ex.folderId]) {
        stats[ex.folderId].count += 1;
        if (ex.weight > stats[ex.folderId].maxWeight) {
          stats[ex.folderId].maxWeight = ex.weight;
        }
      }
    }
    return stats;
  }, [folders, exercises]);

  // Estatísticas para o banner da pasta selecionada
  const currentFolderStats = useMemo(() => {
    if (exercisesInCurrentFolder.length === 0) return { max: 0, avg: 0 };
    const weights = exercisesInCurrentFolder.map((e) => e.weight);
    const max = Math.max(...weights);
    const avg = weights.reduce((sum, w) => sum + w, 0) / weights.length;
    return {
      max,
      avg: Math.round(avg * 10) / 10,
    };
  }, [exercisesInCurrentFolder]);

  // --- Operações CRUD de Pastas ---
  const handleOpenCreateFolderModal = () => {
    setFolderToEdit(null);
    setIsFolderModalOpen(true);
  };

  const handleOpenEditFolderModal = (folder: Folder) => {
    setFolderToEdit(folder);
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = (name: string) => {
    if (folderToEdit) {
      const updated = folders.map((f) => (f.id === folderToEdit.id ? { ...f, name } : f));
      setFolders(updated);
      saveFoldersToStorage(updated);
      showToast(`Grupo muscular renomeado para "${name}"!`, 'success');
    } else {
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name,
        createdAt: new Date().toISOString(),
      };
      const updated = [...folders, newFolder];
      setFolders(updated);
      saveFoldersToStorage(updated);
      showToast(`Grupo muscular "${name}" criado com sucesso!`, 'success');
    }
  };

  const handleConfirmDeleteFolder = () => {
    if (!folderToDelete) return;

    const targetId = folderToDelete.id;
    const folderName = folderToDelete.name;
    const exercisesToRemove = exercises.filter((ex) => ex.folderId === targetId);

    // Remove a pasta e todos os exercícios vinculados a ela
    const updatedFolders = folders.filter((f) => f.id !== targetId);
    const updatedExercises = exercises.filter((ex) => ex.folderId !== targetId);

    setFolders(updatedFolders);
    setExercises(updatedExercises);
    saveFoldersToStorage(updatedFolders);
    saveExercisesToStorage(updatedExercises);

    // Se estiver visualizando a pasta excluída, volta para a tela inicial
    if (selectedFolderId === targetId) {
      setSelectedFolderId(null);
    }

    setFolderToDelete(null);
    if (exercisesToRemove.length > 0) {
      showToast(
        `Pasta "${folderName}" e seus ${exercisesToRemove.length} exercícios foram excluídos.`,
        'info'
      );
    } else {
      showToast(`Pasta "${folderName}" foi excluída.`, 'info');
    }
  };

  // --- Operações CRUD de Exercícios ---
  const handleOpenCreateExerciseModal = () => {
    setExerciseToEdit(null);
    setIsExerciseModalOpen(true);
  };

  const handleOpenEditExerciseModal = (exercise: Exercise) => {
    setExerciseToEdit(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleSaveExercise = (name: string, weight: number, folderId: string) => {
    if (exerciseToEdit) {
      const updated = exercises.map((ex) =>
        ex.id === exerciseToEdit.id
          ? { ...ex, name, weight, folderId, updatedAt: new Date().toISOString() }
          : ex
      );
      setExercises(updated);
      saveExercisesToStorage(updated);
      showToast(`Carga de "${name}" atualizada com sucesso!`, 'success');
    } else {
      const newExercise: Exercise = {
        id: `ex-${Date.now()}`,
        folderId,
        name,
        weight,
        updatedAt: new Date().toISOString(),
      };
      const updated = [newExercise, ...exercises];
      setExercises(updated);
      saveExercisesToStorage(updated);
      showToast(`Exercício "${name}" adicionado com sucesso!`, 'success');
    }
  };

  const handleConfirmDeleteExercise = () => {
    if (!exerciseToDelete) return;

    const exerciseName = exerciseToDelete.name;
    const updated = exercises.filter((ex) => ex.id !== exerciseToDelete.id);
    setExercises(updated);
    saveExercisesToStorage(updated);
    setExerciseToDelete(null);
    showToast(`"${exerciseName}" foi excluído.`, 'info');
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } flex flex-col font-sans transition-colors duration-200`}
    >
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header Contextual (Navegação hierárquica Pastas <-> Exercícios) */}
      <Header
        currentFolderName={currentFolder ? currentFolder.name : null}
        onBackToFolders={() => {
          setSelectedFolderId(null);
          setSearchQuery('');
        }}
        folderCount={folders.length}
        exerciseCount={currentFolder ? exercisesInCurrentFolder.length : exercises.length}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-5 sm:px-6 pb-28">
        {/* ======================================================== */}
        {/* VISTA 1: TELA PRINCIPAL - TODAS AS PASTAS (GRUPOS MUSCULARES) */}
        {/* ======================================================== */}
        {!currentFolder ? (
          <div>
            {/* Banner de apresentação da tela principal */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  Grupos Musculares
                </h2>
                <p className="text-xs text-slate-400">
                  Selecione uma pasta para visualizar e registrar as cargas de cada treino
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateFolderModal}
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20"
              >
                <FolderPlus className="w-4 h-4 stroke-[2.5]" />
                Nova Pasta
              </button>
            </div>

            {/* Busca de pastas */}
            {folders.length > 3 && (
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar grupo muscular..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpar busca"
                    className="min-h-[44px] min-w-[44px] absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Grid/Lista de Pastas */}
            {filteredFolders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredFolders.map((folder) => {
                  const stat = folderStatsMap[folder.id] || { count: 0, maxWeight: 0 };
                  return (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      exerciseCount={stat.count}
                      maxWeight={stat.maxWeight}
                      onSelect={(f) => {
                        setSelectedFolderId(f.id);
                        setSearchQuery('');
                      }}
                      onEdit={handleOpenEditFolderModal}
                      onDelete={(f) => setFolderToDelete(f)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                type="folders"
                onActionClick={handleOpenCreateFolderModal}
                isSearching={Boolean(searchQuery.trim())}
              />
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* VISTA 2: DENTRO DE UMA PASTA - EXERCÍCIOS DO GRUPO MUSCULAR */
          /* ======================================================== */
          <div>
            {/* Resumo de métricas da pasta */}
            {exercisesInCurrentFolder.length > 0 && (
              <section aria-label="Resumo do grupo muscular" className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Carga Máxima ({currentFolder.name})
                    </span>
                    <span className="text-base font-bold font-mono text-white tabular-nums">
                      {formatWeight(currentFolderStats.max)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Média do Grupo
                    </span>
                    <span className="text-base font-bold font-mono text-white tabular-nums">
                      {formatWeight(currentFolderStats.avg)}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Barra de Busca dentro da pasta */}
            {exercisesInCurrentFolder.length > 2 && (
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Buscar exercício em ${currentFolder.name}...`}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpar busca"
                    className="min-h-[44px] min-w-[44px] absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Listagem de Exercícios da Pasta */}
            {filteredExercisesInFolder.length > 0 ? (
              <section aria-label={`Exercícios de ${currentFolder.name}`} className="space-y-2.5">
                {filteredExercisesInFolder.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onEdit={handleOpenEditExerciseModal}
                    onDelete={(ex) => setExerciseToDelete(ex)}
                  />
                ))}
              </section>
            ) : (
              <EmptyState
                type="exercises"
                folderName={currentFolder.name}
                onActionClick={handleOpenCreateExerciseModal}
                isSearching={Boolean(searchQuery.trim())}
              />
            )}
          </div>
        )}
      </main>

      {/* Botão de Ação Flutuante (FAB) na zona ergonômica do polegar */}
      <aside
        aria-label="Ação rápida"
        className="fixed bottom-6 right-6 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:flex sm:justify-end sm:px-6 pointer-events-none z-40"
      >
        {currentFolder ? (
          <button
            type="button"
            onClick={handleOpenCreateExerciseModal}
            aria-label={`Adicionar exercício em ${currentFolder.name}`}
            className="pointer-events-auto min-h-[52px] px-5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-2.5"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Adicionar Exercício</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleOpenCreateFolderModal}
            aria-label="Criar nova pasta de grupo muscular"
            className="pointer-events-auto min-h-[52px] px-5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-2.5"
          >
            <FolderPlus className="w-5 h-5 stroke-[2.5]" />
            <span>Nova Pasta</span>
          </button>
        )}
      </aside>

      {/* Modal de Criação / Edição de Pasta */}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSave={handleSaveFolder}
        folderToEdit={folderToEdit}
      />

      {/* Modal de Confirmação de Exclusão de Pasta (com alerta explícito dos exercícios vinculados) */}
      <ConfirmDeleteFolderModal
        isOpen={Boolean(folderToDelete)}
        folder={folderToDelete}
        exercisesInFolder={
          folderToDelete
            ? exercises.filter((ex) => ex.folderId === folderToDelete.id)
            : []
        }
        onConfirm={handleConfirmDeleteFolder}
        onCancel={() => setFolderToDelete(null)}
      />

      {/* Modal de Criação / Edição de Exercício */}
      <ExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onSave={handleSaveExercise}
        exerciseToEdit={exerciseToEdit}
        folders={folders}
        defaultFolderId={selectedFolderId || undefined}
      />

      {/* Modal de Confirmação de Exclusão de Exercício Individual */}
      <ConfirmDeleteModal
        isOpen={Boolean(exerciseToDelete)}
        exercise={exerciseToDelete}
        onConfirm={handleConfirmDeleteExercise}
        onCancel={() => setExerciseToDelete(null)}
      />
    </div>
  );
}
