"use client";

import React, { useState } from 'react';

interface CalculatorProps {
  onCalculate: (amount: number) => void;
}

const Calculator = ({ onCalculate }: CalculatorProps) => {
  const [assets, setAssets] = useState({
    cash: 0,
    gold: 0,
    silver: 0,
    investments: 0,
    propertyForSale: 0,
    businessInventory: 0,
  });

  const [goldPrice, setGoldPrice] = useState(85); // Nisab value in grams of gold
  const [silverPrice, setSilverPrice] = useState(595); // Nisab value in grams of silver
  
  const [goldValue, setGoldValue] = useState(270); // Default price per gram in MYR
  const [silverValue, setSilverValue] = useState(4.5); // Default price per gram in MYR

  const calculateTotal = () => {
    return Object.values(assets).reduce((sum, value) => sum + value, 0);
  };
  
  const calculateNisab = () => {
    // Return the lower of gold and silver nisab values
    const goldNisab = goldPrice * goldValue;
    const silverNisab = silverPrice * silverValue;
    return Math.min(goldNisab, silverNisab);
  };

  const calculateZakat = () => {
    const totalAssets = calculateTotal();
    const nisabThreshold = calculateNisab();
    
    if (totalAssets >= nisabThreshold) {
      // 2.5% is the standard Zakat rate
      return totalAssets * 0.025;
    }
    
    return 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssets({
      ...assets,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const zakatAmount = calculateZakat();
    onCalculate(zakatAmount);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cash (MYR)</label>
          <input
            type="number"
            name="cash"
            value={assets.cash || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Gold (MYR)</label>
          <input
            type="number"
            name="gold"
            value={assets.gold || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Silver (MYR)</label>
          <input
            type="number"
            name="silver"
            value={assets.silver || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Investments (MYR)</label>
          <input
            type="number"
            name="investments"
            value={assets.investments || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0"
          />
        </div>
        
        <div className="pt-4 mt-2 border-t border-border">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">Total Assets:</span>
            <span className="font-bold">MYR {calculateTotal().toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">Nisab Threshold:</span>
            <span>MYR {calculateNisab().toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between text-base mt-2">
            <span className="font-bold">Zakat Payable (2.5%):</span>
            <span className="font-bold text-primary">MYR {calculateZakat().toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
      >
        Calculate & Add to Chat
      </button>
    </form>
  );
};

export default Calculator; 