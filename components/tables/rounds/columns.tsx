import { ColumnDef } from '@tanstack/react-table';

import { ActionsCell } from '@/components/tables/rounds/cells/actions';
import { CouponMatchDateCell } from '@/components/tables/rounds/cells/coupon-match-date';
import { IsHitCell } from '@/components/tables/rounds/cells/is-hit';
import { PlayedRound } from '@/lib/supabase/database';

type RoundColumn = PlayedRound;

export function getColumns(isLoggedIn: boolean): ColumnDef<RoundColumn>[] {
  return [
    { accessorKey: 'roundNumber', header: 'Runda' },
    {
      accessorKey: 'matchDate',
      header: 'Data rozegrana kuponu',
      cell: ({ row }) => <CouponMatchDateCell row={row} />,
    },
    { accessorKey: 'seasonName', header: 'Sezon' },
    { accessorKey: 'roundType', header: 'Typ rundy' },
    {
      accessorKey: 'correct',
      header: 'Czy trafione?',
      cell: ({ row }) => <IsHitCell row={row} />,
    },
    {
      accessorKey: 'actions',
      header: 'Akcje',
      cell: ({ row }) => <ActionsCell row={row} isLoggedIn={isLoggedIn} />,
    },
  ];
}
