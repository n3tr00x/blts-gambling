'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { removeRound } from '@/lib/supabase/actions/round';
import { withToastPromise } from '@/lib/utilities';

export default function RemoveRoundButton({ matchdayId }: { matchdayId: number }) {
  const reducerRemoveRoundAction = removeRound.bind(null, matchdayId);
  const [, formAction, isPending] = useActionState(
    withToastPromise(reducerRemoveRoundAction, {
      loading: 'Usuwanie rundy...',
      success: result => result.message,
      error: result => result.message,
    }),
    null,
  );

  return (
    <form action={formAction}>
      <Button
        type="submit"
        variant="outline"
        className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
        disabled={isPending}
      >
        {isPending ? 'Przetwarzanie...' : 'Usuń'}
      </Button>
    </form>
  );
}
