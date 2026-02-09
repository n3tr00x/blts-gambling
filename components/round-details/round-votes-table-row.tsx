import { TableCell, TableRow } from '@/components/ui/table';
import { RoundDetails } from '@/lib/supabase/database';

type VotesTableRowProps = {
  player: RoundDetails['votes'][number];
  votes: RoundDetails['votes'];
};

export function RoundVotesTableRow({ player, votes }: VotesTableRowProps) {
  return (
    <TableRow className="text-foreground font-medium">
      <TableCell>{player.voter.username}</TableCell>
      {votes.map(target => {
        const hasVotedFor = player.votesFor.some(vote => vote.id === target.voter.id);

        return (
          <TableCell key={target.voter.id} className="text-center">
            {hasVotedFor ? '✅' : '—'}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
