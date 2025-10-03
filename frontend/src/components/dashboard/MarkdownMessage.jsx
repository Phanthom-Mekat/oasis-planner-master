"use client";

import React, { useState, useEffect, useRef } from 'react';

/**
 * MarkdownMessage Component
 * Renders markdown content with character-by-character typing animation
 */
export default function MarkdownMessage({ content, isTyping, speed = 30 }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const currentIndex = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isTyping || !content) {
      setDisplayedContent(content || '');
      setIsComplete(true);
      return;
    }

    // Reset for new typing animation
    currentIndex.current = 0;
    setDisplayedContent('');
    setIsComplete(false);

    // Start typing animation
    intervalRef.current = setInterval(() => {
      if (currentIndex.current < content.length) {
        setDisplayedContent(prev => prev + content[currentIndex.current]);
        currentIndex.current++;
      } else {
        clearInterval(intervalRef.current);
        setIsComplete(true);
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [content, isTyping, speed]);

  // Simple markdown renderer
  const renderMarkdown = (text) => {
    if (!text) return null;

    // Split by lines
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockLang = '';

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre key={`code-${index}`} className="bg-slate-900/50 border border-blue-500/30 rounded p-3 my-2 overflow-x-auto">
              <code className="text-cyan-300 text-sm font-mono">
                {codeBlockContent.join('\n')}
              </code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // Start code block
          codeBlockLang = line.slice(3);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-lg font-bold text-cyan-300 mt-3 mb-2">
            {processInlineMarkdown(line.slice(4))}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-xl font-bold text-blue-300 mt-4 mb-2">
            {processInlineMarkdown(line.slice(3))}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-2xl font-bold text-blue-200 mt-4 mb-3">
            {processInlineMarkdown(line.slice(2))}
          </h1>
        );
      }
      // Lists
      else if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const content = line.trim().startsWith('• ') ? line.trim().slice(2) : line.trim().slice(2);
        elements.push(
          <li key={index} className="ml-4 my-1 text-slate-200">
            {processInlineMarkdown(content)}
          </li>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line.trim())) {
        const content = line.trim().replace(/^\d+\.\s/, '');
        elements.push(
          <li key={index} className="ml-4 my-1 text-slate-200 list-decimal">
            {processInlineMarkdown(content)}
          </li>
        );
      }
      // Horizontal rule
      else if (line.trim() === '---' || line.trim() === '***') {
        elements.push(
          <hr key={index} className="my-3 border-blue-500/30" />
        );
      }
      // Blockquote
      else if (line.trim().startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="border-l-4 border-blue-500 pl-3 my-2 italic text-slate-300">
            {processInlineMarkdown(line.trim().slice(2))}
          </blockquote>
        );
      }
      // Regular paragraph
      else if (line.trim()) {
        elements.push(
          <p key={index} className="my-1 text-slate-200">
            {processInlineMarkdown(line)}
          </p>
        );
      }
      // Empty line
      else {
        elements.push(<br key={index} />);
      }
    });

    return elements;
  };

  // Process inline markdown (bold, italic, code, links, emojis)
  const processInlineMarkdown = (text) => {
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && remaining.indexOf(boldMatch[0]) === 0) {
        parts.push(
          <strong key={key++} className="font-bold text-blue-200">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic *text*
      const italicMatch = remaining.match(/\*(.+?)\*/);
      if (italicMatch && remaining.indexOf(italicMatch[0]) === 0) {
        parts.push(
          <em key={key++} className="italic text-blue-300">
            {italicMatch[1]}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Inline code `code`
      const codeMatch = remaining.match(/`(.+?)`/);
      if (codeMatch && remaining.indexOf(codeMatch[0]) === 0) {
        parts.push(
          <code key={key++} className="bg-slate-800/70 text-cyan-400 px-1.5 py-0.5 rounded text-sm font-mono">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Links [text](url)
      const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch && remaining.indexOf(linkMatch[0]) === 0) {
        parts.push(
          <a
            key={key++}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // No match, add the next character
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }

    return parts;
  };

  return (
    <div className="markdown-content text-slate-100">
      {renderMarkdown(displayedContent)}
      {isTyping && !isComplete && (
        <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse"></span>
      )}
    </div>
  );
}
