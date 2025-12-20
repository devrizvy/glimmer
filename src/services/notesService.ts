import api from './axios';
import type { Note, Folder, CreateNoteRequest, UpdateNoteRequest, CreateFolderRequest, NotesResponse } from '@/types/notes';

// Real API endpoints for notes backend
const NOTES_ENDPOINTS = {
  // Main CRUD operations
  getAll: '/api/notes',
  create: '/api/notes',
  update: (id: string) => `/api/notes/${id}`,
  delete: (id: string) => `/api/notes/${id}`,
  get: (id: string) => `/api/notes/${id}`,

  // Folder operations
  getAllFolders: '/api/notes/folders',
  createFolder: '/api/notes/folders',
  updateFolder: (id: string) => `/api/notes/folders/${id}`,
  deleteFolder: (id: string) => `/api/notes/folders/${id}`,

  // Search and filter
  search: '/api/notes/search',
  pinNote: (id: string) => `/api/notes/${id}/pin`,
  archiveNote: (id: string) => `/api/notes/${id}/archive`,

  // Batch operations
  bulkDelete: '/api/notes/bulk-delete',
  bulkArchive: '/api/notes/bulk-archive',
  bulkUnarchive: '/api/notes/bulk-unarchive',
  bulkPin: '/api/notes/bulk-pin',
  bulkMove: '/api/notes/bulk-move',
} as const;

// Note API functions
export const notesApi = {
  // Get all notes with optional filtering
  getAllNotes: async (params?: {
    folderId?: string;
    tag?: string;
    isArchived?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<NotesResponse> => {
    const response = await api.get(NOTES_ENDPOINTS.getAll, { params });
    return response.data.data; // Extract data from backend response format
  },

  // Get single note by ID
  getNote: async (id: string): Promise<Note> => {
    const response = await api.get(NOTES_ENDPOINTS.get(id));
    return response.data.data; // Extract data from backend response format
  },

  // Create new note
  createNote: async (noteData: CreateNoteRequest): Promise<Note> => {
    const response = await api.post(NOTES_ENDPOINTS.create, noteData);
    return response.data.data; // Extract data from backend response format
  },

  // Update existing note
  updateNote: async (id: string, noteData: UpdateNoteRequest): Promise<Note> => {
    const response = await api.put(NOTES_ENDPOINTS.update(id), noteData);
    return response.data.data; // Extract data from backend response format
  },

  // Delete note
  deleteNote: async (id: string): Promise<void> => {
    await api.delete(NOTES_ENDPOINTS.delete(id));
  },

  // Toggle pin status
  togglePinNote: async (id: string): Promise<Note> => {
    const response = await api.post(NOTES_ENDPOINTS.pinNote(id));
    return response.data.data; // Extract data from backend response format
  },

  // Toggle archive status
  toggleArchiveNote: async (id: string): Promise<Note> => {
    const response = await api.post(NOTES_ENDPOINTS.archiveNote(id));
    return response.data.data; // Extract data from backend response format
  },

  // Search notes
  searchNotes: async (query: string): Promise<NotesResponse> => {
    const response = await api.get(NOTES_ENDPOINTS.search, { params: { q: query } });
    return response.data.data; // Extract data from backend response format
  },
};

// Folder API functions
export const foldersApi = {
  // Get all folders
  getAllFolders: async (): Promise<Folder[]> => {
    const response = await api.get(NOTES_ENDPOINTS.getAllFolders);
    return response.data.data; // Extract data from backend response format
  },

  // Create new folder
  createFolder: async (folderData: CreateFolderRequest): Promise<Folder> => {
    const response = await api.post(NOTES_ENDPOINTS.createFolder, folderData);
    return response.data.data; // Extract data from backend response format
  },

  // Update folder
  updateFolder: async (id: string, folderData: Partial<CreateFolderRequest>): Promise<Folder> => {
    const response = await api.put(NOTES_ENDPOINTS.updateFolder(id), folderData);
    return response.data.data; // Extract data from backend response format
  },

  // Delete folder
  deleteFolder: async (id: string): Promise<void> => {
    await api.delete(NOTES_ENDPOINTS.deleteFolder(id));
  },
};

// Batch operations
export const batchOperations = {
  // Delete multiple notes
  bulkDelete: async (noteIds: string[]): Promise<void> => {
    await api.post(NOTES_ENDPOINTS.bulkDelete, { noteIds });
  },

  // Archive multiple notes
  bulkArchive: async (noteIds: string[]): Promise<void> => {
    await api.post(NOTES_ENDPOINTS.bulkArchive, { noteIds });
  },

  // Unarchive multiple notes
  bulkUnarchive: async (noteIds: string[]): Promise<void> => {
    await api.post(NOTES_ENDPOINTS.bulkUnarchive, { noteIds });
  },

  // Pin/unpin multiple notes
  bulkPin: async (noteIds: string[], isPinned: boolean): Promise<void> => {
    await api.post(NOTES_ENDPOINTS.bulkPin, { noteIds, isPinned });
  },

  // Move notes to folder
  bulkMove: async (noteIds: string[], folderId?: string): Promise<void> => {
    await api.post(NOTES_ENDPOINTS.bulkMove, { noteIds, folderId });
  },
};