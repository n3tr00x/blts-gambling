import { NewRoundCard } from '@/components/new-round/new-round-card';
import {
  getLatestRound,
  getLeagues,
  getPlayers,
  getRoundTypes,
} from '@/lib/supabase/queries';

export default async function NewRoundPage() {
  const latestRound = await getLatestRound();
  const [leagues, roundTypes, players] = await Promise.all([
    getLeagues(),
    getRoundTypes(),
    getPlayers(),
  ]);

  return (
    <NewRoundCard
      latestRound={latestRound}
      players={players}
      leagues={leagues}
      roundTypes={roundTypes}
    />
  );
}
