import { ReactNode } from 'react';
import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { LeaderboardColumn } from '@/components/leaderboard/columns';
import { Button } from '@/components/ui/button';

type HeaderButtonProps = {
  children: ReactNode;
  column: Column<LeaderboardColumn, unknown>;
};

export function HeaderButton({ children, column }: HeaderButtonProps) {
  const isSortedAscending = column.getIsSorted() === 'asc';

  const toggleSorting = () => {
    column.toggleSorting(column.getIsSorted() === 'asc');
  };

  return (
    <Button variant="ghost" onClick={toggleSorting}>
      {children}
      {isSortedAscending ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
