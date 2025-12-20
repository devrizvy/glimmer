import React, { useState, useRef, useEffect } from 'react';
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/notes';
import {
  Save,
  Tag,
  Palette,
  FolderOpen,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Eye,
  EyeOff,
  Type,
  Hash,
  Strikethrough,
  Sparkles,
  Clock,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PromptDialog } from '@/components/ui/prompt-dialog';
import { AISummaryDialog } from '@/components/ai/AISummaryDialog';
import MarkdownPreview from './MarkdownPreview';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: CreateNoteRequest | UpdateNoteRequest) => void;
  folders: Array<{ id: string; name: string; color: string }>;
}

const PRESET_COLORS = [
  { name: 'None', value: 'none' },
  { name: 'Sunset', value: '#fbbf24' },
  { name: 'Ocean', value: '#34d399' },
  { name: 'Lavender', value: '#a78bfa' },
  { name: 'Rose', value: '#f472b6' },
  { name: 'Sky', value: '#60a5fa' },
  { name: 'Mint', value: '#10b981' },
  { name: 'Peach', value: '#fb923c' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
];

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  folders,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [folderId, setFolderId] = useState(note?.folderId || 'no-folder');
  const [selectedColor, setSelectedColor] = useState(note?.color || 'none');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [linkDialog, setLinkDialog] = useState<{
    isOpen: boolean;
    selectedText: string;
    cursorPosition: { start: number; end: number };
  }>({
    isOpen: false,
    selectedText: '',
    cursorPosition: { start: 0, end: 0 }
  });
  const [aiSummaryDialog, setAiSummaryDialog] = useState<{
    isOpen: boolean;
    initialText: string;
  }>({
    isOpen: false,
    initialText: '',
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset form when note changes
  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setTags(note?.tags || []);
    setFolderId(note?.folderId || 'no-folder');
    setSelectedColor(note?.color || 'none');
  }, [note]);

  // Calculate word and character count
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = (text: string) => {
    return text.length;
  };

  // Helper function to format time in 12-hour format with AM/PM
  const formatTimeTo12Hour = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Auto-save functionality
  useEffect(() => {
    if (note?.id && content && title) {
      const timer = setTimeout(() => {
        const noteData: UpdateNoteRequest = {
          title: title.trim(),
          content: content.trim(),
          tags: tags.length > 0 ? tags : [],
          folderId: folderId === 'no-folder' ? undefined : folderId,
          color: selectedColor === 'none' ? undefined : selectedColor,
        };
        onSave(noteData);
        setLastSaved(new Date());
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [title, content, tags, folderId, selectedColor, note?.id, onSave]);

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsSaving(true);

    try {
      const noteData: CreateNoteRequest | UpdateNoteRequest = {
        title: title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : [],
        folderId: folderId === 'no-folder' ? null : folderId,
        isPinned: false,
        isArchived: false,
        color: selectedColor === 'none' ? null : selectedColor,
      };

      await onSave(noteData);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault();
      handleSave();
    }
  };

  // Enhanced markdown formatting helpers
  const insertFormat = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const formattedText = before + selectedText + after;

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    setLinkDialog({
      isOpen: true,
      selectedText: selectedText,
      cursorPosition: { start, end }
    });
  };

  const handleLinkConfirm = (url: string) => {
    const textarea = textareaRef.current;
    if (!textarea || !url.trim()) return;

    const { start, end } = linkDialog.cursorPosition;
    const linkText = linkDialog.selectedText || url;
    const markdownLink = `[${linkText}](${url.trim()})`;

    const newContent = content.substring(0, start) + markdownLink + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + markdownLink.length,
        start + markdownLink.length
      );
    }, 0);

    setLinkDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleSummarizeCurrent = () => {
    setAiSummaryDialog({
      isOpen: true,
      initialText: content || '',
    });
  };

  const handleSummarizeSelected = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (selectedText.trim()) {
      setAiSummaryDialog({
        isOpen: true,
        initialText: selectedText,
      });
    } else {
      // If no text is selected, summarize entire content
      handleSummarizeCurrent();
    }
  };

  const handleReplaceWithSummary = (summary: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // If there was selected text, replace just that portion
    if (aiSummaryDialog.initialText !== content) {
      const start = content.indexOf(aiSummaryDialog.initialText);
      if (start !== -1) {
        const end = start + aiSummaryDialog.initialText.length;
        const newContent = content.substring(0, start) + summary + content.substring(end);
        setContent(newContent);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + summary.length,
            start + summary.length
          );
        }, 0);
      }
    } else {
      // Replace entire content
      setContent(summary);
    }

    setAiSummaryDialog(prev => ({ ...prev, isOpen: false }));
  };

  const insertHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = content.indexOf('\n', end);
    const currentLine = content.substring(lineStart, lineEnd > -1 ? lineEnd : content.length);

    const heading = '#'.repeat(level) + ' ' + currentLine.trim();
    const newContent = content.substring(0, lineStart) + heading + (lineEnd > -1 ? content.substring(lineEnd) : '');

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = lineStart + heading.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden mira-glass border-white/10 dark:border-white/5 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader className="border-b border-white/10 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-500" />
            <DialogTitle className="text-xl font-semibold">
              {note ? 'Edit Note' : 'Create New Note'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            Create or edit your note with markdown support, tags, and color coding.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[calc(90vh-180px)] overflow-hidden">
          {/* Title input */}
          <div className="mb-4">
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-lg font-semibold bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 focus:border-teal-400 dark:focus:border-teal-600"
            />
          </div>

          {/* Enhanced Toolbar */}
          <div className="flex items-center gap-2 mb-4 p-2 bg-white/5 dark:bg-white/2 rounded-lg">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat('**', '**')}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat('*', '*')}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat('~~', '~~')}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </Button>
            </div>

            <div className="h-6 w-px bg-white/20 dark:bg-white/10 mx-1" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat('- ')}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat('1. ')}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat('> ')}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat('`', '`')}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Inline Code"
              >
                <Code className="w-4 h-4" />
              </Button>
            </div>

            <div className="h-6 w-px bg-white/20 dark:bg-white/10 mx-1" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(1)}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Heading 1"
              >
                <Type className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(2)}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Heading 2"
              >
                <Hash className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={insertLink}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Insert Link"
              >
                <Link className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSummarizeSelected}
                className="h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="Summarize Selected Text"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>

            <div className="h-6 w-px bg-white/20 dark:bg-white/10 mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                "h-8 px-2 hover:bg-white/10 dark:hover:bg-white/5 transition-colors",
                showPreview && "bg-white/10 dark:bg-white/5"
              )}
              title={showPreview ? "Hide Preview" : "Show Preview"}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>

            <div className="h-6 w-px bg-white/20 dark:bg-white/10 mx-1" />

            {/* Color selector */}
            <Select value={selectedColor} onValueChange={(value) => setSelectedColor(value)}>
              <SelectTrigger className="w-32 h-8 bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <SelectValue placeholder="Color" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {PRESET_COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      {color.value !== 'none' ? (
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: color.value }}
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                      )}
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Folder selector */}
            <Select value={folderId || ''} onValueChange={(value) => setFolderId(value)}>
              <SelectTrigger className="w-40 h-8 bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <SelectValue placeholder="Folder" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-folder">No folder</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: folder.color }}
                      />
                      {folder.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content area - Editor or Split View */}
          <div className="flex-1 overflow-hidden mb-4">
            {showPreview ? (
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Editor */}
                <div className="overflow-hidden">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Start writing your note... (supports markdown)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-full resize-none bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 focus:border-teal-400 dark:focus:border-teal-600 font-serif leading-relaxed text-sm"
                    style={{ minHeight: '300px' }}
                  />
                </div>
                {/* Preview */}
                <div className="overflow-auto bg-white/5 dark:bg-white/2 rounded-lg border border-white/10 dark:border-white/5 p-4">
                  <MarkdownPreview content={content} className="text-sm" />
                </div>
              </div>
            ) : (
              <Textarea
                ref={textareaRef}
                placeholder="Start writing your note... (supports markdown)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-full resize-none bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 focus:border-teal-400 dark:focus:border-teal-600 font-serif leading-relaxed"
                style={{ minHeight: '300px' }}
              />
            )}
          </div>

          {/* Word and character count */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <span>{getWordCount(content)} words</span>
              <span>{getCharCount(content)} characters</span>
              {lastSaved && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Clock className="w-3 h-3" />
                  Auto-saved {formatTimeTo12Hour(lastSaved)}
                </span>
              )}
            </div>
            {isSaving && (
              <span className="text-teal-600 dark:text-teal-400">Saving...</span>
            )}
          </div>

          {/* Tags */}
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-teal-500/10 to-teal-600/10 text-teal-700 dark:text-teal-300 border border-teal-200/20 dark:border-teal-800/20"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-teal-900 dark:hover:text-teal-100"
                  >
                    ×
                  </button>
                </span>
              ))}
              {showTagInput ? (
                <div className="flex items-center gap-1">
                  <Input
                    placeholder="Add tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      } else if (e.key === 'Escape') {
                        setShowTagInput(false);
                        setCurrentTag('');
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        if (currentTag.trim()) {
                          handleAddTag();
                        } else {
                          setShowTagInput(false);
                          setCurrentTag('');
                        }
                      }, 200);
                    }}
                    className="h-7 w-24 text-xs bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
                    autoFocus
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTagInput(true)}
                  className="h-7 px-2 text-xs hover:bg-white/10 dark:hover:bg-white/5"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  Add tag
                </Button>
              )}
            </div>
          </div>

          {/* Enhanced Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Press ⌘+Enter to save
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSummarizeCurrent}
                className="h-7 px-3 text-xs hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                title="AI Summarize entire note"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                AI Summarize
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || isSaving}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {note ? 'Update Note' : 'Save Note'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Link Insertion Dialog */}
      <PromptDialog
        isOpen={linkDialog.isOpen}
        onClose={() => setLinkDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleLinkConfirm}
        title="Insert Link"
        description="Enter the URL for your link:"
        placeholder="https://example.com"
        defaultValue={linkDialog.selectedText}
        confirmText="Insert Link"
        cancelText="Cancel"
      />

      {/* AI Summary Dialog */}
      <AISummaryDialog
        isOpen={aiSummaryDialog.isOpen}
        onClose={() => setAiSummaryDialog(prev => ({ ...prev, isOpen: false }))}
        onReplaceWithSummary={handleReplaceWithSummary}
        initialText={aiSummaryDialog.initialText}
        title="AI Text Summarizer"
      />
    </Dialog>
  );
};