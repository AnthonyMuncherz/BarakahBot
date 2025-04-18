"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useCallback
import { Send, Bot, User, RefreshCw, Calculator as CalculatorIcon, X } from 'lucide-react';
import Calculator from './Calculator';
import TypewriterMessage from './TypewriterMessage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const initialMessage: Message = {
    id: '1',
    role: 'assistant',
    content: 'Assalamualaikum! I\'m ZakatBot, your assistant for Zakat calculation and guidance. How can I help you today?',
    timestamp: new Date(),
  };
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable div

  // Function to scroll to bottom, wrapped in useCallback
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: behavior
      });
    }
  }, []); // Empty dependency array as it doesn't depend on component state/props directly

  // Scroll when new messages are added
  useEffect(() => {
    // Use 'auto' for instant scroll when a message is added
    scrollToBottom('auto');
  }, [messages.length, scrollToBottom]); // Trigger only when the number of messages changes


  // Scroll smoothly again when typing finishes for the last message
  const handleTypingComplete = useCallback(() => {
    scrollToBottom('smooth'); // Smooth scroll after typing is done
  }, [scrollToBottom]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = inputMessage.trim();
    if (!trimmedInput || isLoading) return; // Prevent sending empty or while loading

    const userMessage: Message = {
      id: Date.now().toString() + '-user', // Ensure unique ID
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    // Add user message immediately and clear input
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    // Immediately scroll after adding user message
    // Using setTimeout ensures it runs after the state update causes a re-render
    setTimeout(() => scrollToBottom('smooth'), 0);

    // Check for calculator keyword before sending to API
    if (trimmedInput.toLowerCase().includes('calculate') ||
      trimmedInput.toLowerCase().includes('calculator') ||
      trimmedInput.toLowerCase().includes('computation')) {

      const botMessage: Message = {
        id: Date.now().toString() + '-calc-trigger',
        role: 'assistant',
        content: "I can help you calculate your Zakat. I've opened the calculator for you. Please enter your assets, and I'll calculate the amount of Zakat you need to pay.",
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsLoading(false);
      setShowCalculator(true); // Open the dialog
      return; // Don't send calculator requests to the API
    }

    // Prepare messages for API (only user and assistant roles)
    const apiMessages = newMessages.filter(msg => msg.role === 'user' || msg.role === 'assistant').map(msg => ({ role: msg.role, content: msg.content }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }), // Send relevant message history
      });

      setIsLoading(false); // Set loading false *after* getting response but *before* adding message

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `API error: ${response.statusText}` }));
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }

      const data = await response.json();

      const botReply: Message = {
        id: Date.now().toString() + '-bot', // Ensure unique ID
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't get a response.",
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, botReply]);
      // Scrolling is handled by the messages.length useEffect

    } catch (error) {
      console.error("Failed to fetch chat response:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`,
        timestamp: new Date(),
      };
      // Make sure loading is false before adding the error message
      if (isLoading) setIsLoading(false);
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      // Scrolling is handled by the messages.length useEffect
    }
  };

  const handleCalculation = (amount: number) => {
    const formattedAmount = amount.toLocaleString('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const calculationMessage: Message = {
      id: Date.now().toString() + '-calc-result',
      role: 'assistant',
      content: `Based on the assets you provided, your Zakat amount is ${formattedAmount}. Would you like to proceed with payment or have any other questions?`,
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, calculationMessage]);
    setShowCalculator(false); // Close the dialog after calculation
    // Scrolling is handled by the messages.length useEffect
  };

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Chat messages */}
      <div className={`flex flex-col h-[850px] rounded-lg border border-border shadow-sm overflow-hidden bg-card`}>
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-primary" />
            <h3 className="font-medium">ZakatBot</h3>
          </div>
          {/* Calculator Trigger Button */}
          <button
            onClick={() => setShowCalculator(true)} // Open the dialog on click
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            title={"Open calculator"}
          >
            <CalculatorIcon size={18} />
          </button>
        </div>

        {/* Ensure ref is attached to the scrollable container */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((message, index) => (
            <div
              key={message.id} // Using unique ID as key
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] px-5 py-4 rounded-2xl
                  ${message.role === 'user'
                    ? 'bg-secondary text-secondary-foreground rounded-tr-none'
                    : 'bg-muted text-primary rounded-tl-none'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'assistant'
                    ? <Bot size={16} className="text-primary" />
                    : <User size={16} className="text-secondary-foreground" />
                  }
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {/* Pass onComplete only to the *last* assistant message to trigger final scroll */}
                {message.role === 'assistant' ? (
                  <TypewriterMessage
                    content={message.content}
                    onComplete={index === messages.length - 1 ? handleTypingComplete : undefined}
                  />
                ) : (
                  <p className="text-base whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted px-5 py-4 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-2">
                  <Bot size={16} className="text-primary" />
                  <RefreshCw size={16} className="text-primary animate-spin" />
                  <span className="text-sm">ZakatBot is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message input */}
        <div className="border-t border-border p-4 bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about Zakat rules, calculations, or payment methods..."
              className="flex-1 px-5 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-base"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading} // Disable input while loading
            />
            <button
              type="submit"
              className="p-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={!inputMessage.trim() || isLoading} // Disable button when sending or if input is empty
            >
              {/* Show spinner only when actually loading, not just disabled */}
              {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </div>

      {/* Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Zakat Calculator</DialogTitle>
            <DialogDescription>
              Enter your assets below to calculate the Zakat amount. All values in MYR.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {/* Embed the Calculator component here */}
            <Calculator onCalculate={handleCalculation} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
