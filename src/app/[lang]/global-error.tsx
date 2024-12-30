'use client';
import Error from '@/components/Error';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Error error={error} reset={reset} />
      </body>
    </html>
  );
}
