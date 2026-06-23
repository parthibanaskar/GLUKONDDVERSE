'use client';

import { useEffect } from 'react';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error.message, error.stack);
  }, [error]);

  return <ErrorDisplay error={error} reset={reset} />;
}
