'use client';

import Link from 'next/link';
import { Row } from '@tanstack/react-table';
import { EyeIcon, PencilIcon } from 'lucide-react';

import { RemoveRoundDialog } from '@/components/round-form/remove-round-dialog';
import { Button } from '@/components/ui/button';
import { RoundResult } from '@/lib/supabase/database';

type RoundColumn = Omit<RoundResult, 'season_name'>;

type ActionsCellProps = {
  row: Row<RoundColumn>;
  isLoggedIn: boolean;
};

export function ActionsCell({ row, isLoggedIn }: ActionsCellProps) {
  const { id } = row.original;

  return (
    <div className="flex gap-2">
      <Button asChild variant="outline">
        <Link href={`/rounds/${id}`}>
          <EyeIcon /> Podgląd
        </Link>
      </Button>
      {isLoggedIn && (
        <>
          <Button asChild variant="outline">
            <Link href={`/rounds/${id}/edit`}>
              <PencilIcon /> Edytuj
            </Link>
          </Button>
          <RemoveRoundDialog matchdayId={id} />
        </>
      )}
    </div>
  );
}
