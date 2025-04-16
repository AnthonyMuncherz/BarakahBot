"use client";

import React, { useState } from 'react';
import { Send, Bot, User, RefreshCw, Calculator as CalculatorIcon, X } from 'lucide-react';
import Calculator from './Calculator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose, // Assuming DialogClose is available
} from "@/components/ui/dialog"

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Assalamualaikum! I\'m ZakatBot, your assistant for Zakat calculation and guidance. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    if (inputMessage.toLowerCase().includes('calculate') || 
        inputMessage.toLowerCase().includes('calculator') ||
        inputMessage.toLowerCase().includes('computation')) {
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          content: "I can help you calculate your Zakat. I've opened the calculator for you. Please enter your assets, and I'll calculate the amount of Zakat you need to pay.",
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setIsLoading(false);
        setShowCalculator(true); // Open the dialog
      }, 1000);
      return;
    }
    
    setTimeout(() => {
      const botResponses = [
        "Zakat is one of the five pillars of Islam. It's obligatory for Muslims who have wealth above a certain threshold (nisab).",
        "The standard nisab is approximately the value of 85 grams of gold or 595 grams of silver.",
        "For most wealth (money, gold, silver), the Zakat rate is 2.5% of the total value.",
        "I can help you calculate your Zakat based on your assets. Type 'calculate' or 'calculator' to open the Zakat calculator.",
        "You only pay Zakat on assets you've owned for a full lunar year (hawl).",
        "For business inventory, you calculate Zakat on the market value of goods.",
      ];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleCalculation = (amount: number) => {
    const formattedAmount = amount.toLocaleString('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    const calculationMessage: Message = {
      id: Date.now().toString(),
      content: `Based on the assets you provided, your Zakat amount is ${formattedAmount}. Would you like to proceed with payment or have any other questions?`,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, calculationMessage]);
    setShowCalculator(false); // Close the dialog after calculation
  };

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Chat messages */}
      <div className={`flex flex-col h-[700px] rounded-lg border border-border shadow-sm overflow-hidden bg-card lg:col-span-12`}>
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
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[85%] px-5 py-4 rounded-2xl 
                  ${message.sender === 'user' 
                    ? 'bg-secondary text-secondary-foreground rounded-tr-none' 
                    : 'bg-muted text-primary rounded-tl-none'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'bot' 
                    ? <Bot size={16} className="text-primary" /> 
                    : <User size={16} className="text-secondary-foreground" />
                  }
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-base">{message.content}</p>
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
            />
            <button 
              type="submit" 
              className="p-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send size={20} />
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
              Enter your assets below to calculate the Zakat amount.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
             {/* Embed the Calculator component here */}
            <Calculator onCalculate={handleCalculation} />
          </div>
          {/* DialogFooter can be removed if the Calculator component handles its own submission */}
          {/* Or add a close button if needed */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface; 