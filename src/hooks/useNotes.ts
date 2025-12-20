import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateNoteRequest, UpdateNoteRequest, CreateFolderRequest } from '@/types/notes';
import { notesApi, foldersApi } from '@/services/notesService';

// Query keys
export const notesKeys = {
  all: ['notes'] as const,
  lists: () => [...notesKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...notesKeys.lists(), filters] as const,
  details: () => [...notesKeys.all, 'detail'] as const,
  detail: (id: string) => [...notesKeys.details(), id] as const,
};

export const foldersKeys = {
  all: ['folders'] as const,
  lists: () => [...foldersKeys.all, 'list'] as const,
};

// Fetch functions
const fetchNotes = async (filters: Record<string, any>) => {
  try {
    const response = await notesApi.getAllNotes(filters);
    // Sort: pinned notes first, then by updated date
    const sortedNotes = response.notes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return { ...response, notes: sortedNotes };
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    // Return empty data on error to prevent app crash
    return { notes: [], folders: [], total: 0 };
  }
};

const fetchFolders = async () => {
  try {
    const response = await foldersApi.getAllFolders();
    return response;
  } catch (error) {
    console.error('Failed to fetch folders:', error);
    return [];
  }
};

// Hook for notes management
export const useNotes = (filters: {
  folderId?: string | null;
  search?: string;
  isArchived?: boolean;
} = {}) => {
  const queryClient = useQueryClient();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(filters.folderId || null);
  const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
  const [showArchived, setShowArchived] = useState<boolean>(filters.isArchived || false);

  // Get notes with filters
  const {
    data: notesData,
    isLoading: notesLoading,
    isError: notesError,
    error: notesErrorMessage,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: notesKeys.list({ selectedFolder, searchQuery, showArchived }),
    queryFn: () => fetchNotes({
      folderId: selectedFolder || undefined,
      search: searchQuery || undefined,
      isArchived: showArchived,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Get folders
  const {
    data: folders = [],
    isLoading: foldersLoading,
    isError: foldersError,
    error: foldersErrorMessage,
  } = useQuery({
    queryKey: foldersKeys.lists(),
    queryFn: fetchFolders,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: (noteData: CreateNoteRequest) => notesApi.createNote(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteRequest }) =>
      notesApi.updateNote(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => notesApi.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });

  // Toggle pin mutation
  const togglePinMutation = useMutation({
    mutationFn: (id: string) => notesApi.togglePinNote(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
    },
  });

  // Toggle archive mutation
  const toggleArchiveMutation = useMutation({
    mutationFn: (id: string) => notesApi.toggleArchiveNote(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
    },
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: (folderData: CreateFolderRequest) => foldersApi.createFolder(folderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.lists() });
    },
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: (id: string) => foldersApi.deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() }); // Refresh notes in case they were in this folder
    },
  });

  // Action handlers
  const createNote = async (noteData: CreateNoteRequest) => {
    return createNoteMutation.mutateAsync(noteData);
  };

  const updateNote = async (id: string, noteData: UpdateNoteRequest) => {
    return updateNoteMutation.mutateAsync({ id, data: noteData });
  };

  const deleteNote = async (id: string) => {
    return deleteNoteMutation.mutateAsync(id);
  };

  const togglePinNote = async (id: string) => {
    return togglePinMutation.mutateAsync(id);
  };

  const toggleArchiveNote = async (id: string) => {
    return toggleArchiveMutation.mutateAsync(id);
  };

  const createFolder = async (folderData: CreateFolderRequest) => {
    return createFolderMutation.mutateAsync(folderData);
  };

  const deleteFolder = async (id: string) => {
    return deleteFolderMutation.mutateAsync(id);
  };

  return {
    // Data
    notes: notesData?.notes || [],
    folders: folders,
    total: notesData?.total || 0,

    // Loading states
    loading: notesLoading || foldersLoading,
    notesLoading,
    foldersLoading,

    // Error states
    error: notesError || foldersError,
    notesError,
    foldersError,
    errorMessage: notesErrorMessage || foldersErrorMessage,

    // Mutations loading states
    isCreatingNote: createNoteMutation.isPending,
    isUpdatingNote: updateNoteMutation.isPending,
    isDeletingNote: deleteNoteMutation.isPending,
    isCreatingFolder: createFolderMutation.isPending,

    // State
    selectedFolder,
    searchQuery,
    showArchived,

    // Actions
    setSelectedFolder,
    setSearchQuery,
    setShowArchived,
    refetchNotes,

    // CRUD operations
    createNote,
    updateNote,
    deleteNote,
    togglePinNote,
    toggleArchiveNote,
    createFolder,
    deleteFolder,
  };
};

// Hook for a single note
export const useNote = (id: string) => {
  return useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => notesApi.getNote(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};