import { RoundCard } from '@/components/round-form/round-card';
import {
  getLeagues,
  getMatchdaysForSelection,
  getPlayers,
  getRoundTypes,
} from '@/lib/supabase/queries';

export default async function NewRoundPage() {
  const [leagues, roundTypes, players, matchdays] = await Promise.all([
    getLeagues(),
    getRoundTypes(),
    getPlayers(),
    getMatchdaysForSelection(),
  ]);

  return (
    <RoundCard
      matchdays={matchdays}
      players={players}
      leagues={leagues}
      roundTypes={roundTypes}
    />
  );
}
