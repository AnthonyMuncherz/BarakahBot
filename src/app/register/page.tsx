'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// No longer need client-side account for this specific action
// import { account } from '@/lib/appwrite-client'; 
import { AppwriteException } from 'appwrite'; // Keep if needed for other potential errors, though less likely now

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setIsVerificationSent(false);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the error message from the API response
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful via API, custom verification email sent by the API
      console.log("Registration API successful:", data);
      setIsVerificationSent(true); // Set state to show success message
      // Clear form fields if desired
      // setEmail('');
      // setPassword('');
      // setName('');

      // Optional: You could redirect after a short delay or keep the user here
      // setTimeout(() => router.push('/login?registered=true'), 3000); 

    } catch (err: any) {
      console.error("Registration error:", err);
      // Ensure we display the error message from the API or a generic one
      setError(err.message || 'An error occurred during registration.');
      setIsVerificationSent(false); // Ensure verification sent message isn't shown on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                disabled={isLoading || isVerificationSent} // Disable after success too
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
                disabled={isLoading || isVerificationSent} // Disable after success too
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
                disabled={isLoading || isVerificationSent} // Disable after success too
                minLength={8} // Enforce Appwrite's minimum password length
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
            )}
            {/* Show success message ONLY if verification was sent AND there's no error */}
            {isVerificationSent && !error && (
              <p className="text-sm text-green-600 dark:text-green-500">
                Registration successful! Please check your email ({email}) for a verification link.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || isVerificationSent}>
              {isLoading ? 'Creating Account...' : (isVerificationSent ? 'Account Created' : 'Create an account')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
