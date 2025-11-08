'use client';
 
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  const handleReset = () => {
    reset();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-destructive" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Please try again or contact support if the issue persists.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleReset}
            variant="default"
          >
            Try again
          </Button>
          <Button 
            onClick={handleGoHome}
            variant="outline"
          >
            Go home
          </Button>
        </div>

        <div className="text-xs text-muted-foreground/60 pt-4">
          <p>Error code: {error.digest || 'UNKNOWN'}</p>
        </div>
      </div>
    </div>
  );
}