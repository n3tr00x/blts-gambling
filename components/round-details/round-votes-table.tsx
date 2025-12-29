import { TableIcon } from 'lucide-react';

import { InfoSection } from '@/components/round-details/info-section';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RoundDetails } from '@/lib/supabase/database';

type VotesTableRowProps = {
  player: RoundDetails['votes'][number];
  votes: RoundDetails['votes'];
};

function VotesTableRow({ player, votes }: VotesTableRowProps) {
  return (
    <TableRow className="text-foreground font-medium">
      <TableCell>{player.voter.username}</TableCell>

      {votes.map(target => {
        const hasVotedFor = player.votes_for.some(vote => vote.id === target.voter.id);

        return (
          <TableCell key={target.voter.id} className="text-center">
            {hasVotedFor ? '✅' : '—'}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export function RoundVotesTable({ votes }: { votes: RoundDetails['votes'] }) {
  return (
    <InfoSection
      title="Tabela głosowań"
      icon={<TableIcon />}
      className="col-span-1 self-start"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gracz</TableHead>
            {votes.map(v => (
              <TableHead key={v.voter.id} className="text-center">
                {v.voter.username}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {votes.map(player => (
            <VotesTableRow key={player.voter.id} player={player} votes={votes} />
          ))}
        </TableBody>
      </Table>
    </InfoSection>
  );
}
