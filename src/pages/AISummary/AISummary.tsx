import { useState, useEffect } from 'react';
import { aiApi, type SummaryRequest, type SummaryResponse, isInsufficientCreditsError } from '@/services/aiService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Sparkles,
  FileText,
  Clock,
  Zap,
  AlertCircle,
  Loader2,
  Download,
  History,
  Trash2,
  Copy,
  RefreshCw,
  Brain,
  Target,
  Coins,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

const MAX_TEXT_LENGTH = 50000;
const CREDITS_PER_SUMMARY = 3;

interface SummaryHistory {
  id: string;
  originalText: string;
  summary: string;
  timestamp: Date;
  creditsUsed: number;
  remainingCredits: number;
  stats: SummaryResponse['stats'];
}

const AISummary = () => {
  const { user, updateCredits } = useAuth();
  const [inputText, setInputText] = useState('');
  const [currentSummary, setCurrentSummary] = useState<SummaryResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryHistory, setSummaryHistory] = useState<SummaryHistory[]>([]);
  const [activeTab, setActiveTab] = useState('new');
  const [insufficientCreditsError, setInsufficientCreditsError] = useState<{ required: number; current: number } | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('aiSummaryHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setSummaryHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        // Invalid history data, ignore
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (summaryHistory.length > 0) {
      localStorage.setItem('aiSummaryHistory', JSON.stringify(summaryHistory));
    }
  }, [summaryHistory]);

  const handleGenerateSummary = async () => {
    if (!inputText.trim()) return;

    // Check if user has enough credits
    if ((user?.credits ?? 0) < CREDITS_PER_SUMMARY) {
      setInsufficientCreditsError({
        required: CREDITS_PER_SUMMARY,
        current: user?.credits ?? 0
      });
      toast.error(`Insufficient credits. You need ${CREDITS_PER_SUMMARY} credits per request.`);
      return;
    }

    setIsGenerating(true);
    setCurrentSummary(null);
    setInsufficientCreditsError(null);

    try {
      const request: SummaryRequest = {
        text: inputText.trim(),
      };

      const response = await aiApi.summarizeText(request);

      if (response.success && response.remainingCredits !== undefined) {
        setCurrentSummary(response);
        // Update credits in auth context
        updateCredits(response.remainingCredits);
        toast.success(`Summary generated! ${response.creditsUsed} credits used.`);

        // Add to history if successful
        const newHistoryItem: SummaryHistory = {
          id: Date.now().toString(),
          originalText: inputText.trim(),
          summary: response.summary,
          timestamp: new Date(),
          creditsUsed: response.creditsUsed ?? CREDITS_PER_SUMMARY,
          remainingCredits: response.remainingCredits,
          stats: response.stats,
        };
        setSummaryHistory(prev => [newHistoryItem, ...prev].slice(0, 20)); // Keep only last 20 items
      } else {
        toast.error('Failed to generate summary. Please try again.');
      }
    } catch (error: any) {
      if (isInsufficientCreditsError(error)) {
        setInsufficientCreditsError({
          required: error.required,
          current: error.current
        });
        toast.error(error.message);
      } else {
        toast.error('Failed to generate summary. Please try again.');
      }
      setCurrentSummary({
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
    if (currentSummary?.summary) {
      navigator.clipboard.writeText(currentSummary.summary);
      toast.success('Summary copied to clipboard!');
    }
  };

  const handleCopyHistorySummary = (summary: string) => {
    navigator.clipboard.writeText(summary);
    toast.success('Summary copied to clipboard!');
  };

  const handleDownloadSummary = () => {
    if (!currentSummary?.summary) return;

    const blob = new Blob([currentSummary.summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteFromHistory = (id: string) => {
    setSummaryHistory(prev => prev.filter(item => item.id !== id));
    if (summaryHistory.length === 1) {
      localStorage.removeItem('aiSummaryHistory');
    }
  };

  const handleClearAll = () => {
    setInputText('');
    setCurrentSummary(null);
    setInsufficientCreditsError(null);
  };

  const handleReuseSettings = (historyItem: SummaryHistory) => {
    setInputText(historyItem.originalText);
    setActiveTab('new');
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = (wordCount: number) => {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const credits = user?.credits ?? 10;
  const canSummarize = inputText.trim().length > 0 && credits >= CREDITS_PER_SUMMARY;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            AI Text Summarizer
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Transform lengthy text into concise, intelligent summaries using advanced AI technology.
          Perfect for articles, documents, research papers, and more.
        </p>
      </div>

      {/* Credits Display Banner */}
      <Card className={cn(
        "mb-6 border-2",
        credits >= CREDITS_PER_SUMMARY
          ? "bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800"
          : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Coins className={cn(
                "w-5 h-5",
                credits >= CREDITS_PER_SUMMARY ? "text-teal-600 dark:text-teal-400" : "text-amber-600 dark:text-amber-400"
              )} />
              <span className="font-semibold text-lg">
                {credits} Credit{credits !== 1 ? 's' : ''} Available
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Info className="w-4 h-4" />
              <span>{CREDITS_PER_SUMMARY} credits per summarization</span>
            </div>
            {credits < CREDITS_PER_SUMMARY && (
              <>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Low credits - Contact admin for more
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-white/2 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get summaries in seconds, not minutes</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-white/2 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">Accurate & Relevant</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered analysis for precise summaries</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-white/2 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Coins className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">Credit-Based</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{CREDITS_PER_SUMMARY} credits per summarization</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            New Summary
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History ({summaryHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          <Card className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-white/2 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                Create New Summary
              </CardTitle>
              <CardDescription>
                Enter your text below to generate an AI-powered summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-500" />
                    <label className="text-sm font-medium">Original Text</label>
                    {inputText && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getWordCount(inputText)} words • ~{getReadingTime(getWordCount(inputText))} min read
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium",
                      inputText.length > MAX_TEXT_LENGTH * 0.9
                        ? "text-red-500"
                        : "text-gray-500 dark:text-gray-400"
                    )}>
                      {inputText.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}
                    </span>
                    {inputText && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        className="h-8"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  value={inputText}
                  onChange={(e) => {
                    const text = e.target.value;
                    if (text.length <= MAX_TEXT_LENGTH) {
                      setInputText(text);
                    }
                  }}
                  placeholder="Enter or paste the text you want to summarize... (Max 50,000 characters)"
                  className="min-h-[300px] resize-none bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 focus:border-teal-400 dark:focus:border-teal-600 font-mono text-sm"
                />
              </div>

              {/* Insufficient Credits Warning */}
              {insufficientCreditsError && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200">Insufficient Credits</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        You need {insufficientCreditsError.required} credits per request. Your current balance: {insufficientCreditsError.current} credits.
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                        Please contact the administrator to purchase more credits.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerateSummary}
                disabled={!canSummarize || isGenerating}
                className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-lg font-medium disabled:opacity-50 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Summary ({CREDITS_PER_SUMMARY} credits)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Summary Result */}
          {currentSummary && (
            <Card className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-white/2 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-teal-500" />
                  AI Summary Result
                  {currentSummary.success && currentSummary.stats && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {currentSummary.stats.summaryWords} words • ~{getReadingTime(currentSummary.stats.summaryWords)} min read
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSummary.success ? (
                  <>
                    <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                      <p className="whitespace-pre-line text-base leading-relaxed">{currentSummary.summary}</p>
                    </div>

                    {/* Credits Info */}
                    {currentSummary.creditsUsed !== undefined && currentSummary.remainingCredits !== undefined && (
                      <div className="flex items-center justify-center gap-4 p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                            {currentSummary.creditsUsed} credits used
                          </span>
                        </div>
                        <div className="h-4 w-px bg-teal-300 dark:bg-teal-700"></div>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                            {currentSummary.remainingCredits} credits remaining
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    {currentSummary.stats && (
                      <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 dark:bg-white/2 rounded-lg border border-white/10 dark:border-white/5">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                            {currentSummary.stats.originalWords}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Original Words</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {currentSummary.stats.summaryWords}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Summary Words</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {currentSummary.stats.compressionRatio}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Compression</div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/10 dark:border-white/5">
                      <Button variant="outline" size="sm" onClick={handleCopySummary}>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownloadSummary}>
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setInputText('')}>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Start New
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                      Failed to generate summary
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please check your connection and try again
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {summaryHistory.length === 0 ? (
            <Card className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-white/2 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Summary History
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your generated summaries will appear here for quick reference.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {summaryHistory.map((item) => (
                <Card key={item.id} className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-white/2 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {formatDate(item.timestamp)}
                        <div className="flex items-center gap-1 px-2 py-1 bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-full text-xs">
                          <Coins className="w-3 h-3" />
                          {item.creditsUsed} used • {item.remainingCredits} left
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReuseSettings(item)}
                          className="h-8 px-2"
                          title="Reuse settings"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyHistorySummary(item.summary)}
                          className="h-8 px-2"
                          title="Copy summary"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFromHistory(item.id)}
                          className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          title="Delete from history"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Original ({item.stats?.originalWords || 0} words):</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 bg-white/5 dark:bg-white/2 p-3 rounded border border-white/10 dark:border-white/5 line-clamp-2">
                          {item.originalText}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Summary ({item.stats?.summaryWords || 0} words):</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 bg-white/5 dark:bg-white/2 p-3 rounded border border-white/10 dark:border-white/5">
                          {item.summary}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISummary;
