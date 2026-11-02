import { Folder, Exercise } from '../types/exercise';

const FOLDERS_STORAGE_KEY = '@ironload:folders_v2';
const EXERCISES_STORAGE_KEY = '@ironload:exercises_v2';
const OLD_EXERCISES_KEY = '@ironload:exercises_v1';

export const DEFAULT_SUGGESTED_GROUPS = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Abdômen',
  'Antebraço',
  'Glúteos',
];

const INITIAL_FOLDERS: Folder[] = [
  { id: 'folder-peito', name: 'Peito', createdAt: new Date().toISOString() },
  { id: 'folder-costas', name: 'Costas', createdAt: new Date().toISOString() },
  { id: 'folder-pernas', name: 'Pernas', createdAt: new Date().toISOString() },
  { id: 'folder-ombros', name: 'Ombros', createdAt: new Date().toISOString() },
  { id: 'folder-biceps', name: 'Bíceps', createdAt: new Date().toISOString() },
  { id: 'folder-triceps', name: 'Tríceps', createdAt: new Date().toISOString() },
];

const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    folderId: 'folder-peito',
    name: 'Supino Reto com Barra',
    weight: 80,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-2',
    folderId: 'folder-pernas',
    name: 'Agachamento Livre',
    weight: 105,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-3',
    folderId: 'folder-costas',
    name: 'Puxada Alta Frontal',
    weight: 65.5,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-4',
    folderId: 'folder-ombros',
    name: 'Elevação Lateral com Halteres',
    weight: 12.5,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-5',
    folderId: 'folder-biceps',
    name: 'Rosca Direta com Barra W',
    weight: 25,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-6',
    folderId: 'folder-triceps',
    name: 'Tríceps Pulley Corda',
    weight: 32.5,
    updatedAt: new Date().toISOString(),
  },
];

export function getSavedFolders(): Folder[] {
  try {
    const raw = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (!raw) {
      // Primeira inicialização da v2: salvar as pastas padrão
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(INITIAL_FOLDERS));
      return INITIAL_FOLDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Falha ao ler pastas do armazenamento:', error);
    return INITIAL_FOLDERS;
  }
}

export function saveFoldersToStorage(folders: Folder[]): void {
  try {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  } catch (error) {
    console.error('Falha ao salvar pastas no armazenamento:', error);
  }
}

export function getSavedExercises(): Exercise[] {
  try {
    const raw = localStorage.getItem(EXERCISES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    // Se ainda não existir a v2 de exercícios, verificar migração da v1
    const rawOld = localStorage.getItem(OLD_EXERCISES_KEY);
    if (rawOld) {
      try {
        const oldParsed = JSON.parse(rawOld);
        if (Array.isArray(oldParsed) && oldParsed.length > 0) {
          const folders = getSavedFolders();
          const fallbackFolderId = folders[0]?.id || 'folder-peito';

          // Migrar atribuindo pasta baseada no nome ou para pasta padrão
          const migrated: Exercise[] = oldParsed.map((item: any) => {
            const lower = (item.name || '').toLowerCase();
            let matchedFolder = fallbackFolderId;
            if (lower.includes('supino') || lower.includes('peito') || lower.includes('crucifixo')) {
              matchedFolder = 'folder-peito';
            } else if (lower.includes('agachamento') || lower.includes('leg') || lower.includes('perna') || lower.includes('panturrilha')) {
              matchedFolder = 'folder-pernas';
            } else if (lower.includes('puxada') || lower.includes('remada') || lower.includes('costas')) {
              matchedFolder = 'folder-costas';
            } else if (lower.includes('ombro') || lower.includes('elevação') || lower.includes('desenvolvimento')) {
              matchedFolder = 'folder-ombros';
            } else if (lower.includes('rosca') || lower.includes('biceps') || lower.includes('bíceps')) {
              matchedFolder = 'folder-biceps';
            } else if (lower.includes('triceps') || lower.includes('tríceps') || lower.includes('testa')) {
              matchedFolder = 'folder-triceps';
            }

            return {
              id: item.id || `ex-${Date.now()}-${Math.random()}`,
              folderId: item.folderId || matchedFolder,
              name: item.name || 'Exercício',
              weight: typeof item.weight === 'number' ? item.weight : parseFloat(item.weight) || 10,
              updatedAt: item.updatedAt || new Date().toISOString(),
            };
          });

          localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      } catch (e) {
        console.error('Falha na migração da v1:', e);
      }
    }

    // Caso novo: gravar exercícios iniciais vinculados às pastas
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(INITIAL_EXERCISES));
    return INITIAL_EXERCISES;
  } catch (error) {
    console.error('Falha ao ler exercícios do armazenamento:', error);
    return [];
  }
}

export function saveExercisesToStorage(exercises: Exercise[]): void {
  try {
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(exercises));
  } catch (error) {
    console.error('Falha ao salvar exercícios no armazenamento:', error);
  }
}

export function formatWeight(weight: number): string {
  const isInteger = Number.isInteger(weight);
  if (isInteger) {
    return `${weight} kg`;
  }
  return `${Number(weight.toFixed(2))} kg`;
}
