'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (password.length >= 12) return 'Strong';
    if (password.length >= 8) return 'Medium';
    return 'Weak';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setIsVerificationSent(false);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setIsVerificationSent(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
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
            <CardTitle className="text-3xl font-bold text-[#2c5c4b]">Register</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  required
                  disabled={isLoading || isVerificationSent}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isVerificationSent}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isVerificationSent}
                  minLength={8}
                />
                <span className={`text-sm ${getPasswordStrength(password) === 'Strong' ? 'text-green-600' : getPasswordStrength(password) === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                  Strength: {getPasswordStrength(password)}
                </span>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {isVerificationSent && !error && (
                <motion.p 
                  className="text-sm text-green-600 bg-green-100 border border-green-300 rounded-md p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  ✅ Registration successful! Check your email ({email}) for a verification link.
                </motion.p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || isVerificationSent}>
                {isLoading ? 'Creating Account...' : isVerificationSent ? 'Account Created' : 'Create an account'}
              </Button>

              <div className="relative py-4 text-center">
                <span className="absolute left-0 top-1/2 w-full border-t border-gray-300" />
                <span className="bg-white relative px-3 text-gray-500 text-sm">OR</span>
              </div>

              <div className="grid gap-2">
                <Button variant="outline" className="flex items-center gap-3 justify-center">
                  <FcGoogle className="w-5 h-5" /> Continue with Google
                </Button>
                <Button variant="outline" className="flex items-center gap-3 justify-center">
                  <FaFacebook className="w-5 h-5 text-blue-600" /> Continue with Facebook
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="underline text-[#2c5c4b] font-medium hover:text-[#244b3d]">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}