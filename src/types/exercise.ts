export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  folderId: string; // Vínculo obrigatório com uma pasta (grupo muscular)
  name: string;
  weight: number; // Carga em kg (aceita decimais)
  updatedAt: string;
}

export type ToastType = 'success' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}
