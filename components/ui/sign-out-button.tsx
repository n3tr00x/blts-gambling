import { AlertDialogAction } from '@/components/ui/alert-dialog';
import { signOutAction } from '@/lib/supabase/actions/auth';

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <AlertDialogAction type="submit">Wyloguj</AlertDialogAction>
    </form>
  );
}
