'use client';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required autoFocus />
          </div>
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
