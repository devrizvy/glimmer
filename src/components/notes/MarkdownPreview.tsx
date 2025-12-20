import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className }) => {
  // Enhanced markdown parser for preview
  const parseMarkdown = (text: string) => {
    if (!text) return '<p class="text-gray-500 italic">Nothing to preview...</p>';

    // Headers
    let html = text
      .replace(/^###### (.*$)/gim, '<h6 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">$1</h1>');

    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-600 dark:text-gray-400">$1</del>');

    // Bold (make sure this comes before italic to avoid conflicts)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>');

    // Italic
    html = html.replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">$1</code>');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, _lang, code) => {
      return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-200 dark:border-gray-700"><code class="text-sm font-mono text-gray-800 dark:text-gray-200">${code.trim()}</code></pre>`;
    });

    // Links with better security
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
      const isExternal = url.startsWith('http');
      const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}" class="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 underline transition-colors"${targetAttr}>${text}</a>`;
    });

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr class="border-gray-300 dark:border-gray-600 my-4" />');
    html = html.replace(/^\*\*\*$/gm, '<hr class="border-gray-300 dark:border-gray-600 my-4" />');

    // Lists (improved processing)
    const lines = html.split('\n');
    let inList = false;
    let listType = '';
    let processedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Unordered list
      if (/^[•\-\*]\s+/.test(line)) {
        const item = line.replace(/^[•\-\*]\s+/, '<li class="mb-1">') + '</li>';
        if (!inList || listType !== 'ul') {
          if (inList) processedLines.push(`</${listType}>`);
          processedLines.push('<ul class="list-disc list-inside mb-4 space-y-1">');
          inList = true;
          listType = 'ul';
        }
        processedLines.push(item);
      }
      // Ordered list
      else if (/^\d+\.\s+/.test(line)) {
        const item = line.replace(/^\d+\.\s+/, '<li class="mb-1">') + '</li>';
        if (!inList || listType !== 'ol') {
          if (inList) processedLines.push(`</${listType}>`);
          processedLines.push('<ol class="list-decimal list-inside mb-4 space-y-1">');
          inList = true;
          listType = 'ol';
        }
        processedLines.push(item);
      }
      // Not a list item
      else {
        if (inList) {
          processedLines.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        processedLines.push(line);
      }
    }

    if (inList) {
      processedLines.push(`</${listType}>`);
    }

    html = processedLines.join('\n');

    // Blockquotes
    html = html.replace(/^> (.+)/gm, '<blockquote class="border-l-4 border-teal-500 dark:border-teal-400 pl-4 py-2 mb-3 italic text-gray-700 dark:text-gray-300 bg-teal-50 dark:bg-teal-950/20 rounded-r">$1</blockquote>');

    // Paragraphs and line breaks
    html = html.replace(/\n\n+/g, '</p><p class="mb-4">');
    html = html.replace(/^/, '<p class="mb-4">') + (html.endsWith('</p>') ? '' : '</p>');

    // Clean up any empty paragraphs
    html = html.replace(/<p class="mb-4"><\/p>/g, '');
    html = html.replace(/<p class="mb-4">\s*<\/p>/g, '');

    return html;
  };

  return (
    <div
      className={cn(
        "prose prose prose-sm max-w-none text-gray-700 dark:text-gray-300 font-serif leading-relaxed",
        "prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
        "prose-strong:text-gray-900 dark:prose-strong:text-gray-100",
        "prose-code:bg-gray-100 dark:prose-code:bg-gray-800",
        "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800",
        "prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600",
        "prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300",
        "prose-a:text-teal-500 dark:prose-a:text-teal-400",
        "prose-ul:list-disc",
        "animate-in fade-in-0 duration-200",
        className
      )}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};

export default MarkdownPreview;