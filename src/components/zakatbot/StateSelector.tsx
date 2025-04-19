'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { stateThresholds, GOLD_RATE, GOLD_GRAMS } from '@/lib/zakat/stateThresholds';
import { useZakatContext } from '@/context/ZakatContext';

const statesAndTerritories = Object.keys(stateThresholds);

export default function StateSelector() {
  const { selectedState, setSelectedState } = useZakatContext();
  const nisab = stateThresholds[selectedState];

  // ✅ Dynamically derive gold rate based on the current state’s cash nisab
  const actualCashNisab = nisab.cash.nisab;
  const derivedGoldRate = (actualCashNisab / GOLD_GRAMS).toFixed(2);

  const goldNote = `Equivalent to ${GOLD_GRAMS}g gold at RM${derivedGoldRate}/g = RM${actualCashNisab.toLocaleString()}`;

  return (
    <div className="w-full max-w-xl mx-auto mb-6 relative z-20">
      <Label htmlFor="state" className="block mb-2 text-lg font-medium text-gray-700">
        Select your Malaysian state:
      </Label>

      <div className="mb-4">
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger id="state" className="w-full">
            <SelectValue placeholder="Choose a state or territory" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white shadow-lg">
            {statesAndTerritories.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nisab Details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 mt-4 z-0">
        <p>
          <strong>Zakat threshold and rules</strong> may vary based on:{' '}
          <span className="font-semibold text-primary">{selectedState}</span>
        </p>

        <p className="mt-2">
          <strong>Cash Nisab:</strong> RM {nisab.cash.nisab.toLocaleString()}
        </p>
        <p className="ml-4 text-xs text-muted-foreground mt-1">
          💡 {goldNote}
        </p>

        <p className="mt-2"><strong>Gold Nisab:</strong> RM {nisab.gold.nisab.toLocaleString()}</p>
        <p><strong>Silver Nisab:</strong> RM {nisab.silver.nisab.toLocaleString()}</p>
      </div>
    </div>
  );
}