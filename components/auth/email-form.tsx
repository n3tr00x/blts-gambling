'use client';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useSendOtp } from '@/hooks/use-send-otp';

type EmailFormProps = {
  onSuccess: (email: string) => void;
};

export function EmailForm({ onSuccess }: EmailFormProps) {
  const [state, formAction, pending] = useSendOtp(onSuccess);

  return (
    <DialogContent>
      <DialogHeader className="font-secondary">
        <DialogTitle className="text-2xl">Logowanie</DialogTitle>
        {state.message && !state.success && (
          <p className="py-1 text-red-300">{state.message}</p>
        )}
      </DialogHeader>
      <form action={formAction} id="sign-in-form">
        <div className="grid gap-4">
          <Field data-invalid={!state.success && !!state.message}>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="text"
              name="email"
              autoFocus
              aria-invalid={!state.success && !!state.message}
            />
          </Field>
        </div>
      </form>
      <DialogFooter>
        <Button type="submit" form="sign-in-form" disabled={pending}>
          {pending ? 'Przetwarzanie...' : 'Zaloguj się'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
