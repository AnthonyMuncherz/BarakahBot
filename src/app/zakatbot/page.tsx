import React from 'react';
import ChatInterface from '@/components/zakatbot/ChatInterface';

export const metadata = {
  title: 'ZakatBot - Calculate & Pay Your Zakat with AI Assistance',
  description: 'Get personalized Zakat calculation and payment guidance from our AI-powered ZakatBot.',
};

export default function ZakatBotPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background pt-8">
      {/* Main content */}
      <div className="container max-w-screen-xl mx-auto flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              ZakatBot
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your AI assistant for Zakat calculations and guidance. Ask questions about Zakat rules, 
              calculate your obligations, and get personalized advice.
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border py-6 bg-muted/30">
        <div className="container max-w-screen-xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© BarakahBot 2023. All rights reserved.</p>
          <p className="mt-2">ZakatBot provides guidance based on general Zakat principles. For complex cases, please consult with a qualified scholar.</p>
        </div>
      </footer>
    </main>
  );
} 