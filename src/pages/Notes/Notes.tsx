import React, { useState } from 'react';
import type { Note } from '@/types/notes';
import { useNotes } from '@/hooks/useNotes';
import { NoteCard } from '@/components/notes/NoteCard';
import { FolderList } from '@/components/notes/FolderList';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Search,
  Grid,
  List,
  Plus,
  Archive,
  FileText,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

const Notes: React.FC = () => {
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'destructive'
  });

  const [isDeletingFolder, setIsDeletingFolder] = useState(false);

  const {
    notes,
    folders,
    loading,
    error,
    selectedFolder,
    searchQuery,
    showArchived,
    setSelectedFolder,
    setSearchQuery,
    setShowArchived,
    createNote,
    updateNote,
    deleteNote,
    togglePinNote,
    toggleArchiveNote,
    createFolder,
    deleteFolder,
  } = useNotes();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get folder name for display
  const getFolderName = (folderId?: string) => {
    if (!folderId) return undefined;
    const folder = folders.find(f => f.id === folderId);
    return folder?.name;
  };

  // Handle note actions
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setEditorOpen(true);
  };

  const handleSaveNote = (noteData: any) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      createNote(noteData);
    }
  };

  const handleDeleteNote = (note: Note) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Note',
      description: `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteNote(note.id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
      variant: 'destructive'
    });
  };

  const handleCreateFolder = (name: string, color: string) => {
    createFolder({ name, color });
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    const noteCount = folder.noteCount || 0;
    const noteText = noteCount === 1 ? '1 note' : `${noteCount} notes`;

    let description = `Are you sure you want to delete the "${folder.name}" folder?`;

    if (noteCount > 0) {
      description += ` ${noteText} will be moved to "All Notes".`;
    }

    // Check if this is the currently selected folder
    const isSelected = selectedFolder === folderId;
    if (isSelected) {
      description += isSelected ? ' You will be switched to "All Notes".' : '';
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Folder',
      description,
      onConfirm: async () => {
        setIsDeletingFolder(true);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));

        try {
          await deleteFolder(folderId);
          // If this was the selected folder, switch to "All Notes"
          if (isSelected) {
            setSelectedFolder(null);
          }
        } finally {
          setIsDeletingFolder(false);
        }
      },
      variant: 'destructive'
    });
  };

  // Filter notes for display
  const displayNotes = notes;

  return (
    <div className="h-full flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        "border-r border-white/10 dark:border-white/5 bg-background",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-white/5 md:hidden">
            <h2 className="text-lg font-semibold">Folders</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
          {/* Quick Stats */}
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
              {displayNotes.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {showArchived ? 'Archived Notes' : 'Active Notes'}
            </div>
          </div>

          {/* Folders */}
          <FolderList
            folders={folders}
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
            isDeletingFolder={isDeletingFolder}
          />

          {/* View Options */}
          <div className="space-y-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                "hover:bg-white/10 dark:hover:bg-white/5",
                showArchived
                  ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-300 border border-amber-200/20 dark:border-amber-800/20"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              <Archive className="w-4 h-4" />
              {showArchived ? 'Show Active' : 'Show Archived'}
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/10 dark:border-white/5">
          {/* Mobile Header - Menu & Title */}
          <div className="flex items-center gap-3 mb-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Notes
              </h1>
            </div>
            <Button
              onClick={handleCreateNote}
              size="icon"
              className="ml-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Notes
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedFolder ? getFolderName(selectedFolder) : 'All notes'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateNote}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-sm"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-8 w-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notes Grid/List */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-pulse" />
                <p className="text-gray-500 dark:text-gray-400">Loading notes...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
          ) : displayNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-teal-500 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                No notes yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first note to get started
              </p>
              <Button
                onClick={handleCreateNote}
                variant="outline"
                className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-3"
              )}
            >
              {displayNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  folderName={getFolderName(note.folderId)}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onTogglePin={togglePinNote}
                  onToggleArchive={toggleArchiveNote}
                  onClick={() => handleEditNote(note)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Editor Modal */}
      <NoteEditor
        note={editingNote}
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingNote(undefined);
        }}
        onSave={handleSaveNote}
        folders={folders}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeletingFolder}
      />
    </div>
  );
};

export default Notes;
