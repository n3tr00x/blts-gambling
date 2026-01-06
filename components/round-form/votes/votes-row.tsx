'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import { VotesCellTable } from '@/components/round-form/votes/votes-cell';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tables } from '@/lib/supabase/database/database.generated';
import { VotesTableFormValues } from '@/schemas/votes-form.schema';

type VotesRowTableProps = {
  voter: Tables<'players'>;
  voters: Tables<'players'>[];
  rowIndex: number;
};

const MAX_VOTES = 2;

export function VotesRowTable({ voter, voters, rowIndex }: VotesRowTableProps) {
  const { control } = useFormContext<VotesTableFormValues>();

  const votesFor = useWatch<VotesTableFormValues>({
    control,
    name: `votes.${rowIndex}.votesFor`,
  }) as number[];

  return (
    <TableRow>
      <TableCell>{voter.username}</TableCell>
      {voters.map((target, columnIndex) => (
        <VotesCellTable
          key={target.id}
          voterId={voter.id}
          target={target}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          votesFor={votesFor}
          maxVotes={MAX_VOTES}
        />
      ))}
    </TableRow>
  );
}
