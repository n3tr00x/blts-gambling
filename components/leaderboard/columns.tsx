'use client';

import { ColumnDef } from '@tanstack/react-table';

import { HeaderButton } from '@/components/leaderboard/header-button';

export type LeaderboardColumn = {
  position: number;
  username: string;
  hit_picks: number;
  total_picks: number;
  effectiveness: number;
  avg_odds: number;
  total_votes: number;
};

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
    accessorKey: 'hit_picks',
    header: 'Trafione',
  },
  {
    accessorKey: 'total_picks',
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
    accessorKey: 'avg_odds',
    // prettier-ignore
    header: ({ column }) => (
      <HeaderButton column={column}>Średni kurs</HeaderButton>
    ),
  },
  {
    accessorKey: 'total_votes',
    // prettier-ignore
    header: ({ column }) => (
      <HeaderButton column={column}>Głosy</HeaderButton>
    ),
  },
];
