import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function AddRoundButton() {
  return (
    <Button variant="outline" asChild>
      <Link href="/rounds/new">
        <PlusIcon />
        Dodaj nową rundę
      </Link>
    </Button>
  );
}
