'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        const sid = searchParams.get('session_id');
        if (sid) {
            setSessionId(sid);
            // Optional: Verify session ID with your backend here for added security
            // This would involve another API call:
            // fetch(`/api/verify-payment?session_id=${sid}`)
            //   .then(res => res.json())
            //   .then(data => { if(!data.success) setError('Verification failed'); })
            //   .catch(err => setError('Verification error'))
            //   .finally(() => setIsLoading(false));
            setIsLoading(false); // Remove this if doing backend verification
        } else {
            setError('Payment session information not found.');
            setIsLoading(false);
        }
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading payment details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl text-destructive">Payment Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/zakatbot">
                                <Home className="mr-2 h-4 w-4" /> Return to ZakatBot
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                    <CardDescription>Thank you for your Zakat payment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Your transaction has been completed successfully. You may receive a confirmation email shortly.
                    </p>
                    {/* Optionally display session ID for reference */}
                    {/* <p className="text-xs text-gray-400">Session ID: {sessionId}</p> */}
                    <Button asChild>
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" /> Go to Dashboard
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
