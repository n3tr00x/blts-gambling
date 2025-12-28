'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { LoginForm } from '@/components/login-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { signInAction } from '@/lib/supabase/actions/auth';

const INITIAL_CREDENTIALS = { message: '', success: false };

export default function SignInPage() {
  const { replace, back } = useRouter();
  const [open, setOpen] = useState(true);
  const [state, formAction, pending] = useActionState(signInAction, INITIAL_CREDENTIALS);

  const openChangeHandler = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      back();
    }
  };

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      replace('/rounds');
    }
  }, [state.success, replace]);

  return (
    <Dialog open={open} onOpenChange={openChangeHandler}>
      <DialogContent>
        <DialogHeader className="font-secondary">
          <DialogTitle className="text-2xl">Logowanie</DialogTitle>
          {state.message && !state.success && (
            <p className="py-1 text-red-300">{state.message}</p>
          )}
        </DialogHeader>
        <LoginForm formId="sign-in-form" formAction={formAction} />
        <DialogFooter>
          <Button type="submit" form="sign-in-form" disabled={pending}>
            {pending ? 'Przetwarzanie...' : 'Zaloguj się'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
