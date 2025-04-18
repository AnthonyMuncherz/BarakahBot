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
  speed = 20, // Default speed
  className,
  onComplete,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTypedRef = useRef(false);
  const initialContentRef = useRef(content);

  useEffect(() => {
    if (content === initialContentRef.current && !hasTypedRef.current) {
      indexRef.current = 0;
      setIsTyping(true);
      setDisplayedContent('');

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      function typeCharacter() {
        if (indexRef.current < content.length) {
          // *** CHANGE HERE: Use substring instead of charAt + prev ***
          setDisplayedContent(content.substring(0, indexRef.current + 1));
          indexRef.current++;
          timeoutRef.current = setTimeout(typeCharacter, speed);
        } else {
          setIsTyping(false);
          hasTypedRef.current = true;
          if (onComplete) {
            onComplete();
          }
        }
      }

      timeoutRef.current = setTimeout(typeCharacter, speed);

    } else {
      setDisplayedContent(content);
      setIsTyping(false);
      if (!hasTypedRef.current) {
        hasTypedRef.current = true;
      }
      if (content !== initialContentRef.current && onComplete) {
        onComplete();
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, speed, onComplete]);

  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap", className)}>
      <ReactMarkdown>{displayedContent}</ReactMarkdown>
      {isTyping && <span className="blinking-cursor">▋</span>}
    </div>
  );
};

export default TypewriterMessage;
