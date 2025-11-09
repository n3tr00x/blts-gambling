import Link from 'next/link';
import { User } from '@supabase/supabase-js';

import { AlertSignOutDialog } from '@/components/alert-dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ThemeButton } from '@/components/ui/theme-button';

type MobileNavigationProps = {
  user: User | null;
};

export function MobileNavigation({ user }: MobileNavigationProps) {
  return (
    <nav className="flex max-h-screen flex-col justify-between gap-4 p-4 md:hidden">
      <div className="bg-card rounded-xl border-1 p-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="menu">
            <AccordionTrigger className="items-center hover:no-underline">
              <h1 className="font-secondary text-xl font-bold">💸 BLTS Gambling</h1>
            </AccordionTrigger>
            <AccordionContent className="mt-8">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild>
                  <Link href="/leaderboard">Tabele</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/effectivity">Skuteczność</Link>
                </Button>
                {!user ? (
                  <Button variant="outline" className="col-span-2" asChild>
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
                <ThemeButton className="just col-start-2 col-end-3 gap-y-0 justify-self-end" />
              </div>
              <p className="text-center text-sm">© HW, {new Date().getFullYear()}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </nav>
  );
}
