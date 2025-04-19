'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

export default function StaticDonatePage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('FPX');
  const [donor, setDonor] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">💸 Donate to Campaign</h1>

      {step === 1 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">1. Select Donation Amount</h2>
          <Input
            type="number"
            placeholder="Enter amount (RM)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <Button onClick={() => setStep(2)} disabled={!amount}>Next</Button>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">2. Select Payment Method</h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="FPX" id="fpx" />
              <label htmlFor="fpx">Online Banking (FPX)</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Card" id="card" />
              <label htmlFor="card">Credit/Debit Card</label>
            </div>
          </RadioGroup>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Next</Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">3. Donor Information</h2>
            <Input
              placeholder="Full Name"
              value={donor.name}
              onChange={e => setDonor({ ...donor, name: e.target.value })}
              required
            />
            <Input
              placeholder="Email Address"
              type="email"
              value={donor.email}
              onChange={e => setDonor({ ...donor, email: e.target.value })}
              required
            />
            <div className="flex gap-4">
              <Button variant="outline" type="button" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="submit">Confirm</Button>
            </div>
          </Card>
        </form>
      )}

      {step === 4 && (
        <Card className="p-6 space-y-4 text-center">
          <h2 className="text-xl font-semibold">4. Confirm Details</h2>
          <p>Amount: <strong>RM {amount}</strong></p>
          <p>Payment Method: <strong>{paymentMethod}</strong></p>
          <p>Donor: <strong>{donor.name} ({donor.email})</strong></p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={() => setStep(5)}>Donate Now</Button>
          </div>
        </Card>
      )}

      {step === 5 && (
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Donation Successful!</h2>
          <p>Thank you, {donor.name}! Your contribution makes a difference.</p>
          <p className="text-sm text-gray-500 mt-2">A receipt has been sent to {donor.email}</p>
        </Card>
      )}
    </div>
  );
}