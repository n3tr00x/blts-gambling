'use client';

import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tables } from '@/lib/supabase/database/database.generated';

import { VotesRowTable } from './votes-row';

type VotesTableProps = {
  players: Tables<'players'>[];
};

export function VotesFormTable({ players }: VotesTableProps) {
  return (
    <FieldSet className="border p-4">
      <FieldLegend className="text-xl">Tabela głosowań</FieldLegend>
      <FieldDescription>Poniżej zaznacz na kogo dany gracz oddał głos</FieldDescription>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Gracz</TableHead>
            {players.map(p => (
              <TableHead key={p.id} className="text-center">
                {p.username}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((voter, rowIndex) => (
            <VotesRowTable
              key={voter.id}
              voter={voter}
              voters={players}
              rowIndex={rowIndex}
            />
          ))}
        </TableBody>
      </Table>
    </FieldSet>
  );
}
