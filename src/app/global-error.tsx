'use client';

import { useEffect } from 'react';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error.message, error.stack);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorDisplay error={error} reset={reset} isGlobal />
      </body>
    </html>
  );
}
