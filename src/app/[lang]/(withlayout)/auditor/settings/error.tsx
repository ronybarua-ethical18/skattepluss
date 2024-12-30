'use client';

import Error from '@/components/Error';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return <Error error={error} reset={reset} />;
}
