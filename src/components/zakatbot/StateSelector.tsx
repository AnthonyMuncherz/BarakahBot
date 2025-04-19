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
import { stateThresholds } from '@/lib/zakat/stateThresholds';

interface StateSelectorProps {
  selectedState: string;
  setSelectedState: (value: string) => void;
}

const statesAndTerritories = Object.keys(stateThresholds);

export default function StateSelector({ selectedState, setSelectedState }: StateSelectorProps) {
  const nisab = stateThresholds[selectedState];

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

      {/* Nisab details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 mt-4 z-0">
        <p>
          <strong>Zakat threshold and rules</strong> may vary based on:{" "}
          <span className="font-semibold text-primary">{selectedState}</span>
        </p>
        <p className="mt-2">
          <strong>Cash Nisab:</strong> RM {nisab.cash.nisab.toLocaleString()}
          {nisab.cash.notes && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({nisab.cash.notes})
            </span>
          )}
        </p>
        <p><strong>Gold Nisab:</strong> RM {nisab.gold.nisab.toLocaleString()}</p>
        <p><strong>Silver Nisab:</strong> RM {nisab.silver.nisab.toLocaleString()}</p>
      </div>
    </div>
  );
}