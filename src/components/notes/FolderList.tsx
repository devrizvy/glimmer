import React, { useState } from 'react';
import type { Folder as FolderType } from '@/types/notes';
import {
  Folder,
  FolderOpen,
  Plus,
  FolderX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FolderListProps {
  folders: FolderType[];
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onCreateFolder: (name: string, color: string) => void;
  onDeleteFolder: (folderId: string) => void;
  isDeletingFolder?: boolean;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#6366f1', // indigo
  '#14b8a6', // teal
];

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  selectedFolder,
  onFolderSelect,
  onCreateFolder,
  onDeleteFolder,
  isDeletingFolder = false,
}) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), selectedColor);
      setNewFolderName('');
      setCreateDialogOpen(false);
      setSelectedColor(DEFAULT_COLORS[0]);
    }
  };

  const handleDeleteFolder = (folderId: string, _folderName: string, _noteCount: number) => {
    // Prevent deletion if this is the currently selected folder
    if (selectedFolder === folderId) {
      onFolderSelect(null); // Switch to "All Notes" first
    }
    onDeleteFolder(folderId);
  };

  const canDeleteFolder = (folderId: string) => {
    // Allow deletion unless this is the only folder and it has notes
    if (folders.length <= 1) {
      const folder = folders.find(f => f.id === folderId);
      return !folder || folder.noteCount === 0;
    }
    return true;
  };

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Folders
        </h3>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-white/10 dark:hover:bg-white/5"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="mira-glass border-white/10 dark:border-white/5 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Give your folder a name and choose a color.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Color
                </label>
                <div className="flex gap-2">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all duration-200",
                        "hover:scale-110 hover:ring-2 hover:ring-offset-2",
                        selectedColor === color && "ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600",
                        "ring-offset-white dark:ring-offset-gray-900"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Create Folder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* All Notes option */}
      <button
        onClick={() => onFolderSelect(null)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200",
          "hover:bg-white/10 dark:hover:bg-white/5",
          selectedFolder === null
            ? "bg-gradient-to-r from-teal-500/10 to-teal-600/10 text-teal-700 dark:text-teal-300 border border-teal-200/20 dark:border-teal-800/20"
            : "text-gray-700 dark:text-gray-300"
        )}
      >
        <span className="flex items-center gap-2">
          <Folder className="w-4 h-4" />
          All Notes
        </span>
      </button>

      {/* Folder list */}
      {folders.map((folder) => {
        const canDelete = canDeleteFolder(folder.id);
        const isCurrentlySelected = selectedFolder === folder.id;

        return (
          <div
            key={folder.id}
            className={cn(
              "group relative",
              isCurrentlySelected && "bg-white/5 dark:bg-white/2"
            )}
          >
            <button
              onClick={() => onFolderSelect(folder.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200",
                "hover:bg-white/10 dark:hover:bg-white/5 pr-8", // Add extra padding for delete button
                isCurrentlySelected
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-300"
              )}
              title={`${folder.name} - ${folder.noteCount} note${folder.noteCount !== 1 ? 's' : ''}`}
            >
              <span className="flex items-center gap-2 min-w-0 flex-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: folder.color }}
                />
                {isCurrentlySelected ? (
                  <FolderOpen className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <Folder className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="truncate">{folder.name}</span>
              </span>
              <span className={cn(
                "text-xs flex-shrink-0 ml-2",
                folder.noteCount > 0
                  ? "text-gray-600 dark:text-gray-400 font-medium"
                  : "text-gray-400 dark:text-gray-500"
              )}>
                {folder.noteCount}
              </span>
            </button>

            {/* Delete button - only show if not deleting and can be deleted */}
            {!isDeletingFolder && canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6",
                  "opacity-0 group-hover:opacity-100 transition-all duration-200",
                  "text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30",
                  "hover:scale-110"
                )}
                onClick={() => handleDeleteFolder(folder.id, folder.name, folder.noteCount)}
                title={`Delete "${folder.name}"${folder.noteCount > 0 ? ` and move ${folder.noteCount} note${folder.noteCount !== 1 ? 's' : ''} to All Notes` : ''}`}
                disabled={isDeletingFolder}
              >
                <FolderX className="w-3 h-3" />
              </Button>
            )}

            {/* Loading indicator */}
            {isDeletingFolder && (
              <div className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center">
                <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Disabled state for folders that can't be deleted */}
            {!canDelete && folders.length <= 1 && folder.noteCount > 0 && (
              <div
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity duration-200"
                title="Cannot delete the only folder with notes"
              >
                <FolderX className="w-3 h-3 text-gray-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};