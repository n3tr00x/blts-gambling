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
import { NAVIGATION, USER_ACTIONS } from '@/constants/navigation';

type MobileNavigationProps = {
  user: User | null;
};

export function MobileNavigation({ user }: MobileNavigationProps) {
  const currentYear = new Date().getFullYear();

  return (
    <nav className="flex max-h-screen flex-col justify-between gap-4 p-4 lg:hidden">
      <div className="bg-card rounded-xl border-1 p-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="menu">
            <AccordionTrigger className="items-center hover:no-underline">
              <h1 className="font-secondary text-xl font-bold">💸 BLTS Gambling</h1>
            </AccordionTrigger>
            <AccordionContent className="mt-8">
              <div className="grid grid-cols-2 gap-3">
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
              <div className="mt-4 grid grid-cols-2 gap-3">
                {!user ? (
                  <Button variant="outline" className="col-span-2" asChild>
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
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link href={action.href!}>
                              {action.icon} {action.label}
                            </Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </>
                )}
                <ThemeButton className="just col-start-2 col-end-3 gap-y-0 justify-self-end" />
              </div>
              <p className="text-center text-sm">© HW, {currentYear}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </nav>
  );
}
