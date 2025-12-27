import { ColumnDef } from '@tanstack/react-table';

import { ActionsCell } from '@/components/tables/rounds/cells/actions-cell';
import { HitCell } from '@/components/tables/rounds/cells/hit-cell';
import { RoundResult } from '@/lib/supabase/database';

type RoundColumn = Omit<RoundResult, 'season_name'>;

export function getColumns(isLoggedIn: boolean): ColumnDef<RoundColumn>[] {
  return [
    {
      accessorKey: 'round_number',
      header: 'Runda',
    },
    {
      accessorKey: 'match_date',
      header: 'Data rozegrana kuponu',
    },
    {
      accessorKey: 'round_type',
      header: 'Typ rundy',
    },
    {
      accessorKey: 'correct',
      header: 'Czy trafione?',
      cell: HitCell,
    },
    {
      accessorKey: 'actions',
      header: 'Akcje',
      cell: ({ row }) => {
        return <ActionsCell row={row} isLoggedIn={isLoggedIn} />;
      },
    },
  ];
}
