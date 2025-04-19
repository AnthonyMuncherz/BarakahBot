'use client';

import React, { useState } from 'react';
import ChatInterface from '@/components/zakatbot/ChatInterface';
import StateSelector from '@/components/zakatbot/StateSelector';
import { stateThresholds } from '@/lib/zakat/stateThresholds';

export default function ZakatBotClientPage() {
  const [selectedState, setSelectedState] = useState('Selangor');
  const threshold = stateThresholds[selectedState];

  return (
    <main className="flex min-h-screen flex-col bg-background pt-8">
      <div className="container max-w-screen-xl mx-auto flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              ZakatBot
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your AI assistant for Zakat calculations and guidance. Ask questions about Zakat rules, 
              calculate your obligations, and get personalized advice based on your selected Malaysian state.
            </p>
          </div>

          <StateSelector selectedState={selectedState} setSelectedState={setSelectedState} />

          <div className="text-center text-sm text-muted-foreground mb-6">
            <p>
              <strong>{selectedState}</strong> Cash Nisab: RM {threshold.cash.nisab.toLocaleString()}
            </p>
            {threshold.cash.notes && <p className="text-xs mt-1">💡 {threshold.cash.notes}</p>}
          </div>

          <ChatInterface selectedState={selectedState} />
        </div>
      </div>

      <footer className="border-t border-border py-6 bg-muted/30">
        <div className="container max-w-screen-xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© BarakahBot 2025. All rights reserved.</p>
          <p className="mt-2">
            ZakatBot provides guidance based on general and state-specific Zakat principles. For complex cases, please consult with a qualified scholar.
          </p>
        </div>
      </footer>
    </main>
  );
}