'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginFormProps = {
  formId: string;
  formAction: (payload: FormData) => void;
};

export function LoginForm({ formId, formAction }: LoginFormProps) {
  return (
    <form action={formAction} id={formId}>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Hasło</Label>
          <Input type="password" id="password" name="password" required />
        </div>
      </div>
    </form>
  );
}
