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
    try {
      const response = await api.get(NOTES_ENDPOINTS.getAll, { params });
      let responseData: any;

      // Handle different response formats
      if (response.data.data) {
        responseData = response.data.data;
      } else if (response.data) {
        responseData = response.data;
      } else {
        // Fallback empty response
        return { notes: [], folders: [], total: 0 };
      }

      // Transform notes to normalize ID
      const notes = (responseData.notes || []).map((note: any) => ({
        id: note._id || note.id,
        title: note.title,
        content: note.content,
        folderId: note.folderId,
        tags: note.tags || [],
        isPinned: note.isPinned || false,
        isArchived: note.isArchived || false,
        color: note.color,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }));

      // Transform folders to normalize ID
      const folders = (responseData.folders || []).map((folder: any) => ({
        id: folder._id || folder.id,
        name: folder.name,
        color: folder.color,
        icon: folder.icon,
        createdAt: folder.createdAt,
        noteCount: folder.noteCount || 0
      }));

      return {
        notes,
        folders,
        total: responseData.total || notes.length
      };
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Return empty data on error to prevent app crash
      return { notes: [], folders: [], total: 0 };
    }
  },

  // Get single note by ID
  getNote: async (id: string): Promise<Note> => {
    const response = await api.get(NOTES_ENDPOINTS.get(id));
    const note = response.data.data || response.data;
    // Normalize ID for frontend compatibility
    return {
      id: note._id || note.id,
      title: note.title,
      content: note.content,
      folderId: note.folderId,
      tags: note.tags || [],
      isPinned: note.isPinned || false,
      isArchived: note.isArchived || false,
      color: note.color,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    };
  },

  // Create new note
  createNote: async (noteData: CreateNoteRequest): Promise<Note> => {
    const response = await api.post(NOTES_ENDPOINTS.create, noteData);
    const note = response.data.data || response.data;
    // Normalize ID for frontend compatibility
    return {
      id: note._id || note.id,
      title: note.title,
      content: note.content,
      folderId: note.folderId,
      tags: note.tags || [],
      isPinned: note.isPinned || false,
      isArchived: note.isArchived || false,
      color: note.color,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    };
  },

  // Update existing note
  updateNote: async (id: string, noteData: UpdateNoteRequest): Promise<Note> => {
    const response = await api.put(NOTES_ENDPOINTS.update(id), noteData);
    const note = response.data.data || response.data;
    // Normalize ID for frontend compatibility
    return {
      id: note._id || note.id,
      title: note.title,
      content: note.content,
      folderId: note.folderId,
      tags: note.tags || [],
      isPinned: note.isPinned || false,
      isArchived: note.isArchived || false,
      color: note.color,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    };
  },

  // Delete note
  deleteNote: async (id: string): Promise<void> => {
    await api.delete(NOTES_ENDPOINTS.delete(id));
  },

  // Toggle pin status
  togglePinNote: async (id: string): Promise<Note> => {
    try {
      const response = await api.post(NOTES_ENDPOINTS.pinNote(id));
      const note = response.data.data || response.data;
      // Normalize ID for frontend compatibility
      return {
        id: note._id || note.id,
        title: note.title,
        content: note.content,
        folderId: note.folderId,
        tags: note.tags || [],
        isPinned: note.isPinned || false,
        isArchived: note.isArchived || false,
        color: note.color,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      };
    } catch (error) {
      console.error('Pin endpoint not available:', error);
      throw new Error('Pin/unpin feature is not yet implemented');
    }
  },

  // Toggle archive status
  toggleArchiveNote: async (id: string): Promise<Note> => {
    try {
      const response = await api.post(NOTES_ENDPOINTS.archiveNote(id));
      const note = response.data.data || response.data;
      // Normalize ID for frontend compatibility
      return {
        id: note._id || note.id,
        title: note.title,
        content: note.content,
        folderId: note.folderId,
        tags: note.tags || [],
        isPinned: note.isPinned || false,
        isArchived: note.isArchived || false,
        color: note.color,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      };
    } catch (error) {
      console.error('Archive endpoint not available:', error);
      throw new Error('Archive/unarchive feature is not yet implemented');
    }
  },
};

// Folder API functions
export const foldersApi = {
  // Get all folders
  getAllFolders: async (): Promise<Folder[]> => {
    try {
      const response = await api.get(NOTES_ENDPOINTS.getAllFolders);
      let folders: any[] = [];

      // Handle different response formats
      if (response.data.data) {
        folders = response.data.data;
      } else if (response.data) {
        folders = Array.isArray(response.data) ? response.data : response.data.folders || [];
      }

      // Transform _id to id for frontend compatibility
      return folders.map(folder => ({
        id: folder._id || folder.id,
        name: folder.name,
        color: folder.color,
        icon: folder.icon,
        createdAt: folder.createdAt,
        noteCount: folder.noteCount || 0
      }));
    } catch (error) {
      console.error('Failed to fetch folders:', error);
      return [];
    }
  },

  // Create new folder
  createFolder: async (folderData: CreateFolderRequest): Promise<Folder> => {
    const response = await api.post(NOTES_ENDPOINTS.createFolder, folderData);
    const folder = response.data.data || response.data;
    // Normalize ID for frontend compatibility
    return {
      id: folder._id || folder.id,
      name: folder.name,
      color: folder.color,
      icon: folder.icon,
      createdAt: folder.createdAt,
      noteCount: folder.noteCount || 0
    };
  },

  // Update folder
  updateFolder: async (id: string, folderData: Partial<CreateFolderRequest>): Promise<Folder> => {
    const response = await api.put(NOTES_ENDPOINTS.updateFolder(id), folderData);
    const folder = response.data.data || response.data;
    // Normalize ID for frontend compatibility
    return {
      id: folder._id || folder.id,
      name: folder.name,
      color: folder.color,
      icon: folder.icon,
      createdAt: folder.createdAt,
      noteCount: folder.noteCount || 0
    };
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