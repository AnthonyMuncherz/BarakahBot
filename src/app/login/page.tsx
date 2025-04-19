'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.get('registered') === 'true') {
      setSuccessMessage('Registration successful! Please log in.');
      router.replace('/login', { scroll: false });
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      setSuccessMessage('Login successful! Redirecting to dashboard...');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
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
            <CardTitle className="text-3xl font-bold text-[#2c5c4b]">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <motion.p
                className="text-sm text-green-600 text-center bg-green-100 border border-green-300 rounded-md p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
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
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                    Remember Me
                  </label>
                </div>

                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
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
              Don’t have an account?{' '}
              <Link href="/register" className="underline text-[#2c5c4b] font-medium hover:text-[#244b3d]">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}