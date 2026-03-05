import { PlayersEffectivenessProgressChart } from '@/components/charts/players-effectiveness-progress';
import { FlattenedPlayersEffectivenessProgress } from '@/lib/supabase/database';
import { getPlayersEffectivenessProgress } from '@/lib/supabase/queries';

export default async function PlayersEffectivenessProgress() {
  const effectivenessData = await getPlayersEffectivenessProgress(30);
  const flattenData = effectivenessData
    .sort((a, b) => a.roundNumber - b.roundNumber)
    .map(round => ({
      ...round.data,
      roundNumber: round.roundNumber.toString(),
    })) as FlattenedPlayersEffectivenessProgress[];

  return <PlayersEffectivenessProgressChart data={flattenData} />;
}
