"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, RefreshCw, Calculator as CalculatorIcon, CreditCard } from 'lucide-react';
import Calculator from './Calculator';
import TypewriterMessage from './TypewriterMessage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/context/AuthContext';
import { stateThresholds } from '@/lib/zakat/stateThresholds';
import { useZakatContext } from '@/context/ZakatContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isCalculationResult?: boolean;
  calculatedAmount?: number;
}

const ChatInterface = () => {
  const { user } = useAuth();
  const { selectedState } = useZakatContext();
  const nisab = stateThresholds[selectedState];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages.length, scrollToBottom]);

  const handleTypingComplete = useCallback(() => {
    scrollToBottom('smooth');
  }, [scrollToBottom]);

  // ✅ Reactive greeting message when state changes
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'intro',
      role: 'assistant',
      content: `Assalamualaikum! I'm ZakatBot, your assistant for Zakat calculation and guidance in ${selectedState}. The cash nisab here is RM ${nisab.cash.nisab.toLocaleString()}. How can I help you today?`,
      timestamp: new Date(),
    };

    setMessages((prev) => {
      if (prev.length === 0 || prev[0].id === 'intro') {
        return [welcomeMessage];
      }
      return prev;
    });
  }, [selectedState, nisab.cash.nisab]);

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

    if (trimmedInput.toLowerCase().includes('calculate') || trimmedInput.toLowerCase().includes('calculator')) {
      const botMessage: Message = {
        id: Date.now().toString() + '-calc-trigger',
        role: 'assistant',
        content: "I've opened the calculator for you. Please enter your assets, and I'll compute your Zakat obligation.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setShowCalculator(true);
      return;
    }

    const apiMessages = newMessages.filter(msg => msg.role !== 'system').map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const systemPrompt = `You are ZakatBot, a helpful assistant. The user is from ${selectedState}, where the cash nisab is RM ${nisab.cash.nisab}. Base your Zakat answers on this threshold.`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: systemPrompt }, ...apiMessages],
        }),
      });

      if (!response.ok) throw new Error('API call failed');

      const data = await response.json();
      const botReply: Message = {
        id: Date.now().toString() + '-bot',
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't get a response.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botReply]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (amount: number) => {
    setIsPaymentLoading(true);
    try {
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          userId: user?.$id || 'anonymous',
          campaign: `Zakat Payment - ${selectedState}`
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Error:', data.error);
        
        const errorMsg: Message = {
          id: Date.now().toString() + '-payment-error',
          role: 'assistant',
          content: `Sorry, there was an error processing your payment: ${data.error}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
        
        return;
      }

      if (data.sessionId) {
        console.log("Redirecting to Stripe session:", data.sessionId);
        
        // Use Stripe.js to properly redirect to checkout
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Failed to load Stripe');
        }
        
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId
        });
        
        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      const errorMsg: Message = {
        id: Date.now().toString() + '-payment-error',
        role: 'assistant',
        content: 'Sorry, there was an error processing your payment. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex flex-col h-[850px] rounded-lg border border-border shadow-sm overflow-hidden bg-card">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-primary" />
            <h3 className="font-medium">ZakatBot</h3>
          </div>
          <button
            onClick={() => setShowCalculator(true)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            title="Open calculator"
          >
            <CalculatorIcon size={18} />
          </button>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={msg.id} className="flex flex-col">
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-2xl ${msg.role === 'user' ? 'bg-secondary text-secondary-foreground rounded-tr-none' : 'bg-muted text-primary rounded-tl-none'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === 'assistant' ? <Bot size={16} className="text-primary" /> : <User size={16} className="text-secondary-foreground" />}
                    <span className="text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {msg.role === 'assistant' ? (
                    <TypewriterMessage content={msg.content} onComplete={i === messages.length - 1 ? handleTypingComplete : undefined} />
                  ) : (
                    <p className="text-base whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
              
              {msg.isCalculationResult && msg.calculatedAmount && msg.calculatedAmount > 0 && (
                <div className={`mt-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <Button 
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                    onClick={() => handlePayment(msg.calculatedAmount!)}
                    disabled={isPaymentLoading}
                  >
                    {isPaymentLoading ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <CreditCard size={16} />
                    )}
                    Pay your Zakat here
                  </Button>
                </div>
              )}
            </div>
          ))}

          {isLoading && !isPaymentLoading && (
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

        <div className="border-t border-border p-4 bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about Zakat rules, thresholds, or contributions..."
              className="flex-1 px-5 py-3 rounded-md border border-input bg-background focus:outline-none text-base"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading || isPaymentLoading}
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

      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Zakat Calculator</DialogTitle>
            <DialogDescription>
              Enter your assets below to calculate the Zakat amount. All values in MYR.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Calculator onCalculate={(amount: number) => {
              const formatted = amount.toLocaleString('en-MY', {
                style: 'currency',
                currency: 'MYR',
              });
              const msg: Message = {
                id: Date.now().toString() + '-calc',
                role: 'assistant',
                content: `Based on ${selectedState}'s cash nisab (RM ${nisab.cash.nisab.toLocaleString()}), your Zakat is ${formatted}.`,
                timestamp: new Date(),
                isCalculationResult: true,
                calculatedAmount: amount,
              };
              setMessages(prev => [...prev, msg]);
              setShowCalculator(false);
            }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;