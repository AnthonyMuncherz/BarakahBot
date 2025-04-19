// ✅ 1. --- Create a Context to Share Selected State Globally ---
// src/context/ZakatContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ZakatContextType {
  selectedState: string;
  setSelectedState: (state: string) => void;
}

const ZakatContext = createContext<ZakatContextType | undefined>(undefined);

export const ZakatProvider = ({ children }: { children: ReactNode }) => {
  const [selectedState, setSelectedState] = useState('Selangor');
  return (
    <ZakatContext.Provider value={{ selectedState, setSelectedState }}>
      {children}
    </ZakatContext.Provider>
  );
};

export const useZakatContext = () => {
  const context = useContext(ZakatContext);
  if (!context) {
    throw new Error('useZakatContext must be used within ZakatProvider');
  }
  return context;
}

