'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      setSuccessMessage(`Password reset email sent to ${email}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdfaf5] px-4">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-xl border border-gray-200">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-[#2c5c4b]">Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <motion.p
                className="text-sm text-green-600 text-center bg-green-100 border border-green-300 rounded-md p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✅ {successMessage}
              </motion.p>
            )}

            {error && (
              <motion.p
                className="text-sm text-red-600 bg-red-100 border border-red-300 rounded-md p-3 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ❌ {error}
              </motion.p>
            )}

            <form onSubmit={handleSubmit} className="grid gap-5 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending reset link...' : 'Send Reset Link'}
              </Button>

              <div className="mt-6 text-center text-sm text-gray-600">
                <Link href="/login" className="underline text-[#2c5c4b] font-medium hover:text-[#244b3d]">
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
