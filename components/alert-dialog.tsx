import { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { SignOutButton } from './ui/sign-out-button';

type AlertSignOutDialog = { children: ReactNode };

export function AlertSignOutDialog({ children }: AlertSignOutDialog) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz sie wylogować?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <SignOutButton />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
