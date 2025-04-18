"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface TypewriterMessageProps {
  content: string;
  speed?: number; // Milliseconds per character
  className?: string;
  onComplete?: () => void; // Optional callback when typing finishes
}

const TypewriterMessage: React.FC<TypewriterMessageProps> = ({
  content,
  speed = 30, // Default speed
  className,
  onComplete,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset when content changes
    setDisplayedContent('');
    indexRef.current = 0;
    setIsTyping(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    function typeCharacter() {
      if (indexRef.current < content.length) {
        setDisplayedContent((prev) => prev + content.charAt(indexRef.current));
        indexRef.current++;
        timeoutRef.current = setTimeout(typeCharacter, speed);
      } else {
        setIsTyping(false);
        if (onComplete) {
          onComplete();
        }
      }
    }

    timeoutRef.current = setTimeout(typeCharacter, speed);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, speed, onComplete]);

  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap", className)}>
      <ReactMarkdown>{displayedContent}</ReactMarkdown>
      {isTyping && <span className="blinking-cursor">▋</span>}
    </div>
  );
};

export default TypewriterMessage;