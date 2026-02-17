import Link from 'next/link';
import { User } from '@supabase/supabase-js';

import { AlertSignOutDialog } from '@/components/alert-dialog';
import { Button } from '@/components/ui/button';
import { ThemeButton } from '@/components/ui/theme-button';
import { NAVIGATION, USER_ACTIONS } from '@/constants/navigation';

type MainNavigationProps = { user: User | null };

export function MainNavigation({ user }: MainNavigationProps) {
  const currentYear = new Date().getFullYear();

  return (
    <nav className="sticky top-0 left-0 hidden h-screen flex-col justify-between gap-4 p-4 lg:flex">
      <div className="bg-card rounded-xl border-1 p-6">
        <h1 className="font-secondary text-xl font-bold">💸 BLTS Gambling</h1>
      </div>
      <div className="bg-card flex flex-1 flex-col justify-between rounded-xl border-1 p-6">
        <div className="flex flex-col gap-3">
          {NAVIGATION.map((navLink, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start"
              asChild
            >
              <Link href={navLink.href!}>
                {navLink.icon} {navLink.label}
              </Link>
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {!user ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/sign-in">Panel admina</Link>
            </Button>
          ) : (
            <>
              {USER_ACTIONS.map((action, index) => (
                <div key={index}>
                  {action.type === 'sign-out' ? (
                    <AlertSignOutDialog>
                      <Button variant="outline" className="w-full justify-start">
                        {action.icon} {action.label}
                      </Button>
                    </AlertSignOutDialog>
                  ) : (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={action.href!}>
                        {action.icon} {action.label}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </>
          )}
          <div className="flex items-center justify-between">
            <ThemeButton />
            <span className="text-sm">© HW, {currentYear}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
