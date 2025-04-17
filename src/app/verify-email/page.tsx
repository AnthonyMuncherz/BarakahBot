'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const userId = searchParams.get('userId');
      const token = searchParams.get('token');

      if (!userId || !token) {
        setError('Invalid verification link');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        // Redirect to login page after successful verification
        router.push('/login?verified=true');
      } catch (error) {
        console.error('Error verifying email:', error);
        setError(error instanceof Error ? error.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h1>
            <p className="text-gray-600">{error}</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </>
        )}
      </div>
    </div>
  );
} 