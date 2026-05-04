import { TopPickedLeaguesByPlayersChart } from '@/components/charts/top-picked-leagues-by-players';
import { getTopLeagueByPlayers } from '@/lib/supabase/queries/charts';

export default async function PlayerTopLeaguePage() {
  const data = await getTopLeagueByPlayers();

  return <TopPickedLeaguesByPlayersChart data={data} />;
}
