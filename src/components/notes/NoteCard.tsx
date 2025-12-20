import React, { useState } from 'react';
import type { Note } from '@/types/notes';
import { formatDistanceToNow } from 'date-fns';
import {
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  Folder
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  folderName?: string;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (noteId: string) => void;
  onToggleArchive: (noteId: string) => void;
  onClick?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  folderName,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get text preview (first 100 characters)
  const getTextPreview = (content: string) => {
    // Remove markdown formatting for preview
    const plainText = content
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/^\s*[-*+]\s/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s/gm, '') // Remove numbered lists
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  const handleMenuAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className={cn(
        "group relative mira-glass rounded-xl p-4 cursor-all-pointer transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1",
        "border border-white/10 dark:border-white/5",
        note.isPinned && "ring-2 ring-yellow-400/50 dark:ring-yellow-500/50",
        isHovered && "backdrop-blur-xl"
      )}
      style={{
        background: note.color ? `${note.color}10` : undefined,
        borderColor: note.color ? `${note.color}30` : undefined,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pinned indicator */}
      {note.isPinned && (
        <div className="absolute top-3 right-3">
          <Pin className="w-4 h-4 text-yellow-500 dark:text-yellow-400" fill="currentColor" />
        </div>
      )}

      {/* Card content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight text-gray-900 dark:text-gray-100 line-clamp-2">
          {note.title}
        </h3>

        {/* Preview */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 font-serif leading-relaxed">
          {getTextPreview(note.content)}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
          {folderName && (
            <span className="flex items-center gap-1">
              <Folder className="w-3 h-3" />
              {folderName}
            </span>
          )}
          <span className="flex items-center gap-1">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-teal-500/10 to-teal-600/10 text-teal-700 dark:text-teal-300 border border-teal-200/20 dark:border-teal-800/20"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-500">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover overlay with actions */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 pointer-events-none",
          isHovered && "opacity-100"
        )}
      />

      {/* Action buttons */}
      <div
        className={cn(
          "absolute bottom-3 right-3 flex items-center gap-1 opacity-0 transition-all duration-300",
          isHovered && "opacity-100"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/20 dark:hover:bg-white/10 text-white"
          onClick={(e) => handleMenuAction(e, () => onTogglePin(note.id))}
        >
          {note.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/20 dark:hover:bg-white/10 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="mira-glass border-white/10 dark:border-white/5 backdrop-blur-xl"
          >
            <DropdownMenuItem
              onClick={(e) => handleMenuAction(e, () => onEdit(note))}
              className="hover:bg-white/10 dark:hover:bg-white/5"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => handleMenuAction(e, () => onToggleArchive(note.id))}
              className="hover:bg-white/10 dark:hover:bg-white/5"
            >
              {note.isArchived ? (
                <>
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Unarchive
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 dark:bg-white/5" />
            <DropdownMenuItem
              onClick={(e) => handleMenuAction(e, () => onDelete(note))}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-500/10 dark:hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Color indicator (if note has custom color) */}
      {note.color && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
          style={{ backgroundColor: note.color }}
        />
      )}
    </div>
  );
};