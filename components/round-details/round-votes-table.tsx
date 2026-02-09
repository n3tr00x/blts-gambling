import { TableIcon } from 'lucide-react';

import { InfoSection } from '@/components/round-details/info-section';
import { RoundVotesTableRow } from '@/components/round-details/round-votes-table-row';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RoundDetails } from '@/lib/supabase/database';

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
            {votes.map(vote => (
              <TableHead key={vote.voter.id} className="text-center">
                {vote.voter.username}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {votes.map(player => (
            <RoundVotesTableRow key={player.voter.id} player={player} votes={votes} />
          ))}
        </TableBody>
      </Table>
    </InfoSection>
  );
}
