import React, { useState, useEffect } from 'react';
import { aiApi, type SummaryRequest, type SummaryResponse, type AIServiceStatus } from '@/services/aiService';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sparkles,
  FileText,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle2,
  Loader2,
  List,
  AlignLeft
} from 'lucide-react';

interface AISummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReplaceWithSummary?: (summary: string) => void;
  initialText?: string;
  title?: string;
}

export const AISummaryDialog: React.FC<AISummaryDialogProps> = ({
  isOpen,
  onClose,
  onReplaceWithSummary,
  initialText = '',
  title = 'AI Summarizer'
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [summaryStyle, setSummaryStyle] = useState<'concise' | 'bullet'>('concise');
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<AIServiceStatus | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setInputText(initialText);
      setSummary(null);
      checkServiceStatus();
    }
  }, [isOpen, initialText]);

  const checkServiceStatus = async () => {
    try {
      const status = await aiApi.getServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      setServiceStatus({
        available: false,
        service: 'unknown',
        message: 'Unable to check AI service status'
      });
    }
  };

  const handleGenerateSummary = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setSummary(null);

    try {
      const request: SummaryRequest = {
        text: inputText.trim(),
        length: summaryLength,
        style: summaryStyle,
      };

      const response = await aiApi.summarizeText(request);
      setSummary(response);
    } catch (error: any) {
      console.error('Failed to generate summary:', error);
      setSummary({
        success: false,
        summary: '',
        stats: {
          originalLength: 0,
          summaryLength: 0,
          compressionRatio: '0%',
          originalWords: 0,
          summaryWords: 0,
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySummary = () => {
    if (summary?.summary) {
      navigator.clipboard.writeText(summary.summary);
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = (wordCount: number) => {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden mira-glass border-white/10 dark:border-white/5 backdrop-blur-xl">
        <DialogHeader className="border-b border-white/10 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            Generate AI-powered summaries with different lengths and styles
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col h-[calc(90vh-200px)]">
          {/* Service Status */}
          {serviceStatus && (
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg mb-4",
              serviceStatus.available
                ? "bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-300"
                : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300"
            )}>
              {serviceStatus.available ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Service Online</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Service Offline</span>
                </>
              )}
            </div>
          )}

          {/* Input Section */}
          <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
            {/* Left side - Input */}
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-teal-500" />
                <label className="text-sm font-medium">Original Text</label>
                {inputText && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getWordCount(inputText)} words • ~{getReadingTime(getWordCount(inputText))} min read
                  </span>
                )}
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter or paste the text you want to summarize..."
                className="flex-1 resize-none bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 focus:border-teal-400 dark:focus:border-teal-600 font-mono text-sm"
                style={{ minHeight: '300px' }}
              />
            </div>

            {/* Right side - Summary */}
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-teal-500" />
                <label className="text-sm font-medium">AI Summary</label>
                {summary?.success && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {summary.stats.summaryWords} words • ~{getReadingTime(summary.stats.summaryWords)} min read
                  </span>
                )}
              </div>
              <div className="flex-1 bg-white/5 dark:bg-white/2 rounded-lg border border-white/10 dark:border-white/5 p-4 overflow-auto">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Generating summary...
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      This may take a few moments
                    </p>
                  </div>
                ) : summary ? (
                  summary.success ? (
                    <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                      {summaryStyle === 'bullet' ? (
                        <div className="whitespace-pre-line">{summary.summary}</div>
                      ) : (
                        <p className="whitespace-pre-line">{summary.summary}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Failed to generate summary
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Please try again or check your connection
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles className="w-8 h-8 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your AI summary will appear here
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Enter text and click "Generate Summary"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          {summary?.success && (
            <div className="bg-white/5 dark:bg-white/2 rounded-lg border border-white/10 dark:border-white/5 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Summary Statistics
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-600 dark:text-gray-400">
                  <span>Original: {summary.stats.originalWords} words</span>
                  <span>Summary: {summary.stats.summaryWords} words</span>
                  <span>Compression: {summary.stats.compressionRatio}</span>
                </div>
              </div>
            </div>
          )}

          {/* Options */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Length:
              </label>
              <Select value={summaryLength} onValueChange={(value: 'short' | 'medium' | 'long') => setSummaryLength(value)}>
                <SelectTrigger className="w-32 h-8 bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (50-100 words)</SelectItem>
                  <SelectItem value="medium">Medium (100-200 words)</SelectItem>
                  <SelectItem value="long">Long (200-400 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Style:
              </label>
              <Select value={summaryStyle} onValueChange={(value: 'concise' | 'bullet') => setSummaryStyle(value)}>
                <SelectTrigger className="w-32 h-8 bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">
                    <div className="flex items-center gap-2">
                      <AlignLeft className="w-3 h-3" />
                      Concise
                    </div>
                  </SelectItem>
                  <SelectItem value="bullet">
                    <div className="flex items-center gap-2">
                      <List className="w-3 h-3" />
                      Bullet Points
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
          >
            Close
          </Button>
          {summary?.success && (
            <>
              <Button
                variant="outline"
                onClick={handleCopySummary}
                className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
              >
                Copy Summary
              </Button>
              {onReplaceWithSummary && (
                <Button
                  variant="outline"
                  onClick={() => onReplaceWithSummary(summary.summary)}
                  className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
                >
                  Replace with Summary
                </Button>
              )}
            </>
          )}
          <Button
            onClick={handleGenerateSummary}
            disabled={!inputText.trim() || isGenerating || !serviceStatus?.available}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Summary
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};