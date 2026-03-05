'use client';

import { ColumnDef } from '@tanstack/react-table';

import { HeaderButton } from '@/components/leaderboard/header-button';
import { RankingByMonth } from '@/lib/supabase/database';

// export type LeaderboardColumn = {
//   position: number;
//   username: string;
//   hit_picks: number;
//   total_picks: number;
//   effectiveness: number;
//   avg_odds: number;
//   total_votes: number;
// };

export type LeaderboardColumn = RankingByMonth;

export const columns: ColumnDef<LeaderboardColumn>[] = [
  {
    accessorKey: 'position',
    // prettier-ignore
    header: ({ column }) => (
      <HeaderButton column={column}>Pozycja</HeaderButton>
    ),
  },
  {
    accessorKey: 'username',
    header: 'Gracz',
  },
  {
    accessorKey: 'hitPicks',
    header: 'Trafione',
  },
  {
    accessorKey: 'totalPicks',
    header: 'Typy',
  },
  {
    accessorKey: 'effectiveness',
    cell: ({ cell }) => <div>{cell.row.original.effectiveness}%</div>,
    // prettier-ignore
    header: ({ column }) => (
      <HeaderButton column={column}>Skuteczność</HeaderButton>
    ),
  },
  {
    accessorKey: 'avgOdds',
    // prettier-ignore
    header: ({ column }) => (
      <HeaderButton column={column}>Średni kurs</HeaderButton>
    ),
  },
  {
    accessorKey: 'totalVotes',
    // prettier-ignore
    header: ({ column }) => (
      <HeaderButton column={column}>Głosy</HeaderButton>
    ),
  },
];
