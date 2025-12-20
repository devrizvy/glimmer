import React, { useState, useEffect, useRef } from 'react';
import { aiApi, type SummaryRequest, type SummaryResponse, type AIServiceStatus } from '@/services/aiService';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  CheckCircle2,
  Loader2,
  List,
  AlignLeft,
  Download,
  History,
  Trash2,
  Copy,
  RefreshCw,
  Upload,
  Brain,
  Target
} from 'lucide-react';

interface SummaryHistory {
  id: string;
  originalText: string;
  summary: string;
  timestamp: Date;
  settings: {
    length: 'short' | 'medium' | 'long';
    style: 'concise' | 'bullet';
  };
  stats: SummaryResponse['stats'];
}

const AISummary = () => {
  const [inputText, setInputText] = useState('');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [summaryStyle, setSummaryStyle] = useState<'concise' | 'bullet'>('concise');
  const [currentSummary, setCurrentSummary] = useState<SummaryResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<AIServiceStatus | null>(null);
  const [summaryHistory, setSummaryHistory] = useState<SummaryHistory[]>([]);
  const [activeTab, setActiveTab] = useState('new');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        console.error('Failed to parse summary history:', error);
      }
    }
    checkServiceStatus();
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (summaryHistory.length > 0) {
      localStorage.setItem('aiSummaryHistory', JSON.stringify(summaryHistory));
    }
  }, [summaryHistory]);

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
    setCurrentSummary(null);

    try {
      const request: SummaryRequest = {
        text: inputText.trim(),
        length: summaryLength,
        style: summaryStyle,
      };

      const response = await aiApi.summarizeText(request);
      setCurrentSummary(response);

      // Add to history if successful
      if (response.success) {
        const newHistoryItem: SummaryHistory = {
          id: Date.now().toString(),
          originalText: inputText.trim(),
          summary: response.summary,
          timestamp: new Date(),
          settings: {
            length: summaryLength,
            style: summaryStyle,
          },
          stats: response.stats,
        };
        setSummaryHistory(prev => [newHistoryItem, ...prev].slice(0, 20)); // Keep only last 20 items
      }
    } catch (error: any) {
      console.error('Failed to generate summary:', error);
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
    }
  };

  const handleCopyHistorySummary = (summary: string) => {
    navigator.clipboard.writeText(summary);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    }
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
  };

  const handleReuseSettings = (historyItem: SummaryHistory) => {
    setInputText(historyItem.originalText);
    setSummaryLength(historyItem.settings.length);
    setSummaryStyle(historyItem.settings.style);
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

      {/* Service Status */}
      {serviceStatus && (
        <div className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto",
          serviceStatus.available
            ? "bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
            : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
        )}>
          {serviceStatus.available ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">AI Service Online • Ready to summarize</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">AI Service Offline • Please try again later</span>
            </>
          )}
        </div>
      )}

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
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">Customizable</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose length and style that fits your needs</p>
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
                Enter your text below and customize the summary options to get started.
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
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload File
                    </Button>
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
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter or paste the text you want to summarize... You can also upload a .txt file above."
                  className="min-h-[300px] resize-none bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 focus:border-teal-400 dark:focus:border-teal-600 font-mono text-sm"
                />
              </div>

              {/* Options Section */}
              <div className="flex items-center gap-6 p-4 bg-white/5 dark:bg-white/2 rounded-lg border border-white/10 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Length:</label>
                  <Select value={summaryLength} onValueChange={(value: 'short' | 'medium' | 'long') => setSummaryLength(value)}>
                    <SelectTrigger className="w-40 h-8 bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10">
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
                  <label className="text-sm font-medium">Style:</label>
                  <Select value={summaryStyle} onValueChange={(value: 'concise' | 'bullet') => setSummaryStyle(value)}>
                    <SelectTrigger className="w-40 h-8 bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">
                        <div className="flex items-center gap-2">
                          <AlignLeft className="w-3 h-3" />
                          Concise Paragraph
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

              {/* Generate Button */}
              <Button
                onClick={handleGenerateSummary}
                disabled={!inputText.trim() || isGenerating || !serviceStatus?.available}
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
                    Generate AI Summary
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
                  {currentSummary.success && (
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
                      {summaryStyle === 'bullet' ? (
                        <div className="whitespace-pre-line">{currentSummary.summary}</div>
                      ) : (
                        <p className="whitespace-pre-line text-base leading-relaxed">{currentSummary.summary}</p>
                      )}
                    </div>

                    {/* Stats */}
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
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {formatDate(item.timestamp)}
                        <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-full text-xs">
                          {item.settings.length}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                          {item.settings.style}
                        </span>
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
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Original ({item.stats.originalWords} words):</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 bg-white/5 dark:bg-white/2 p-3 rounded border border-white/10 dark:border-white/5 line-clamp-2">
                          {item.originalText}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Summary ({item.stats.summaryWords} words):</div>
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
