import { PlayersOddsByRoundChart } from '@/components/charts/players-odds-by-round';
import { FlattenedOddsByRound } from '@/lib/supabase/database';
import { getPlayersOddsByRound } from '@/lib/supabase/queries';

export default async function PlayersOddsByRoundPage() {
  const rounds = await getPlayersOddsByRound(15);
  const flattenData = rounds
    .sort((a, b) => a.roundNumber - b.roundNumber)
    .map(round => ({
      ...round.data,
      roundNumber: round.roundNumber.toString(),
    })) as FlattenedOddsByRound[];

  return <PlayersOddsByRoundChart data={flattenData} />;
}
