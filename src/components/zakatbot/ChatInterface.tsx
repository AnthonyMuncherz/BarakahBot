"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, RefreshCw, Calculator as CalculatorIcon, CreditCard } from 'lucide-react'; // Added CreditCard
import Calculator from './Calculator';
import TypewriterMessage from './TypewriterMessage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button'; // Import Button
import { loadStripe, Stripe } from '@stripe/stripe-js'; // Import Stripe types

// Load Stripe outside the component to avoid reloading on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isCalculationResult?: boolean; // Flag to identify the specific message
  calculatedAmount?: number; // Store the raw amount for payment
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
  const [isPaymentLoading, setIsPaymentLoading] = useState(false); // State for payment button loading
  const [showCalculator, setShowCalculator] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: behavior
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages.length, scrollToBottom]);

  const handleTypingComplete = useCallback(() => {
    scrollToBottom('smooth');
  }, [scrollToBottom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputMessage.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);
    setTimeout(() => scrollToBottom('smooth'), 0);

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
      setShowCalculator(true);
      return;
    }

    const apiMessages = newMessages.filter(msg => msg.role === 'user' || msg.role === 'assistant').map(msg => ({ role: msg.role, content: msg.content }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `API error: ${response.statusText}` }));
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }

      const data = await response.json();
      const botReply: Message = {
        id: Date.now().toString() + '-bot',
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't get a response.",
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Failed to fetch chat response:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`,
        timestamp: new Date(),
      };
      if (isLoading) setIsLoading(false);
      setMessages(prevMessages => [...prevMessages, errorMessage]);
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
      // Use a clear message indicating payment is possible
      content: `Based on the assets you provided, your Zakat amount is ${formattedAmount}. You can proceed to payment below or ask further questions.`,
      timestamp: new Date(),
      isCalculationResult: true, // Mark this message
      calculatedAmount: amount, // Store the raw amount
    };

    setMessages(prevMessages => [...prevMessages, calculationMessage]);
    setShowCalculator(false);
  };

  // Function to handle Stripe redirect
  const handleProceedToPayment = async (amount: number) => {
    if (amount <= 0) {
      console.error("Cannot proceed with zero or negative amount.");
      // Optionally show an error message to the user
      return;
    }
    setIsPaymentLoading(true);
    try {
      // Get Stripe.js instance
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js failed to load.');
      }

      // Call your backend to create the Checkout Session
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount }), // Send the raw amount
      });

      const sessionData = await response.json();

      if (!response.ok) {
        throw new Error(sessionData.error || 'Failed to create payment session.');
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionData.sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        // Handle error (e.g., display error message to user)
        // Add an error message to the chat?
        const errorMsg: Message = {
          id: Date.now().toString() + '-stripe-error',
          role: 'assistant',
          content: `Sorry, there was an error redirecting to payment: ${error.message}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      const errorMsg: Message = {
        id: Date.now().toString() + '-payment-error',
        role: 'assistant',
        content: `Sorry, there was an error initiating the payment process: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsPaymentLoading(false);
    }
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
          <button
            onClick={() => setShowCalculator(true)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            title={"Open calculator"}
          >
            <CalculatorIcon size={18} />
          </button>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((message, index) => (
            <div
              key={message.id}
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
                {message.role === 'assistant' ? (
                  <TypewriterMessage
                    content={message.content}
                    onComplete={index === messages.length - 1 ? handleTypingComplete : undefined}
                  />
                ) : (
                  <p className="text-base whitespace-pre-wrap">{message.content}</p>
                )}

                {/* Add Payment Button conditionally */}
                {message.isCalculationResult && message.calculatedAmount && message.calculatedAmount > 0 && (
                  <Button
                    onClick={() => handleProceedToPayment(message.calculatedAmount!)}
                    disabled={isPaymentLoading}
                    className="mt-4 w-full"
                    size="sm"
                  >
                    {isPaymentLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    {isPaymentLoading ? 'Processing...' : `Proceed with Payment (RM ${message.calculatedAmount.toFixed(2)})`}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {isLoading && !isPaymentLoading && ( // Don't show "thinking" if payment is processing
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
              disabled={isLoading || isPaymentLoading} // Disable during API call or payment redirect
            />
            <button
              type="submit"
              className="p-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={!inputMessage.trim() || isLoading || isPaymentLoading}
            >
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
            <Calculator onCalculate={handleCalculation} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
