import { notFound } from 'next/navigation';

import { RoundCard } from '@/components/round-form/round-card';
import {
  getLeagues,
  getMatchdaysForSelection,
  getPlayers,
  getRoundForEdit,
  getRoundTypes,
} from '@/lib/supabase/queries';

type EditRoundPageProps = { params: Promise<{ id: string }> };

export default async function EditRoundPage({ params }: EditRoundPageProps) {
  const { id } = await params;
  const round = await getRoundForEdit(id);

  if (!round) {
    notFound();
  }

  const [leagues, roundTypes, players, matchdays] = await Promise.all([
    getLeagues(),
    getRoundTypes(),
    getPlayers(),
    getMatchdaysForSelection(),
  ]);

  return (
    <RoundCard
      matchdayId={id}
      round={round}
      matchdays={matchdays}
      players={players}
      leagues={leagues}
      roundTypes={roundTypes}
    />
  );
}
