import Link from 'next/link';
import { User } from '@supabase/supabase-js';

import { AlertSignOutDialog } from '@/components/alert-dialog';
import { Button } from '@/components/ui/button';
import { ThemeButton } from '@/components/ui/theme-button';

type MainNavigationProps = {
  user: User | null;
};

export function MainNavigation({ user }: MainNavigationProps) {
  return (
    <nav className="sticky top-0 left-0 hidden h-screen flex-col justify-between gap-4 p-4 md:flex">
      <div className="bg-card rounded-xl border-1 p-6">
        <h1 className="font-secondary text-xl font-bold">💸 BLTS Gambling</h1>
      </div>
      <div className="bg-card flex flex-1 flex-col justify-between rounded-xl border-1 p-6">
        <div className="flex flex-col gap-3">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/leaderboard">Tabele</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/effectivity">Skuteczność</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {!user ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/sign-in">Panel admina</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" className="w-full">
                Dodaj nowe zdarzenie
              </Button>
              <AlertSignOutDialog>
                <Button variant="outline" className="w-full">
                  Wyloguj
                </Button>
              </AlertSignOutDialog>
            </>
          )}
          <div className="flex items-center justify-between">
            <ThemeButton />
            <span className="text-sm">© HW, {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
