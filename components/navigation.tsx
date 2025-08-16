import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ThemeButton } from '@/components/ui/theme-button';

export function Navigation() {
  return (
    <nav className="flex flex-col justify-between gap-4 p-4">
      <div className="bg-card rounded-xl border-1 p-6">
        <h1 className="font-secondary text-xl font-bold">💸 BLTS Gambling</h1>
      </div>
      <div className="bg-card flex flex-1 flex-col justify-between rounded-xl border-1 p-6">
        <div />
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/sign-in">Panel admina</Link>
          </Button>
          <div className="flex items-center justify-between">
            <ThemeButton />
            <span className="text-sm">© HW, {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
