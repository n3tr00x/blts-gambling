'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

type RoundsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RoundsError({ error, reset }: RoundsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <h2 className="text-3xl font-semibold">Ups. Coś poszło nie tak</h2>
      <Button onClick={reset}>Spróbuj odświeżyć stronę lub wróć później.</Button>
    </div>
  );
}
