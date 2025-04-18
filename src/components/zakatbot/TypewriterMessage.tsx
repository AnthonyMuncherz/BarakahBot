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
  speed = 20, // Default speed (made slightly faster)
  className,
  onComplete,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track if typing has started/completed for the *initial* content passed to this instance
  const hasTypedRef = useRef(false);
  // Ref to store the initial content this component was rendered with
  const initialContentRef = useRef(content);

  useEffect(() => {
    // Only start typing animation if the content hasn't changed from the initial render
    // and the typing hasn't already completed for that initial content.
    if (content === initialContentRef.current && !hasTypedRef.current) {
      indexRef.current = 0; // Ensure index resets if needed (though should be 0 initially)
      setIsTyping(true); // Ensure typing state is true
      setDisplayedContent(''); // Start with empty display

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
          hasTypedRef.current = true; // Mark typing as complete for this instance
          if (onComplete) {
            onComplete();
          }
        }
      }

      // Start the typing timeout
      timeoutRef.current = setTimeout(typeCharacter, speed);

    } else {
      // If content is different from initial OR typing already completed,
      // display the full content immediately without animation.
      setDisplayedContent(content);
      setIsTyping(false);
      if (!hasTypedRef.current) {
        // If content changed *before* initial typing completed, mark as complete now
        hasTypedRef.current = true;
      }
      // If content changed and there's an onComplete, call it immediately
      if (content !== initialContentRef.current && onComplete) {
        onComplete();
      }
    }

    // Cleanup function: clear timeout on unmount or before effect re-runs
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [content, speed, onComplete]); // Rerun effect if these change

  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap", className)}>
      {/* Use ReactMarkdown to render potential markdown in the content */}
      <ReactMarkdown>{displayedContent}</ReactMarkdown>
      {/* Show blinking cursor only while typing */}
      {isTyping && <span className="blinking-cursor">▋</span>}
    </div>
  );
};

export default TypewriterMessage;
