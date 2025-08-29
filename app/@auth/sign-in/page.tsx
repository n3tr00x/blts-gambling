'use client';

import { useActionState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { signInAction } from '@/actions/auth';
import { LoginForm } from '@/components/login-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const INITIAL_CREDENTIALS = { message: '' };

export default function SignInPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(signInAction, INITIAL_CREDENTIALS);
  const isSignInPath = pathname.startsWith('/sign-in');

  return (
    <Dialog open={isSignInPath} onOpenChange={open => !open && router.back()}>
      <DialogContent>
        <DialogHeader className="font-secondary">
          <DialogTitle className="text-2xl">Logowanie</DialogTitle>
          {state.message && <p className="py-1 text-red-300">{state.message}</p>}
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
