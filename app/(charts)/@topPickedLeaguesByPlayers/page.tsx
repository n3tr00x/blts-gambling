import { TopPickedLeaguesByPlayersChart } from '@/components/charts/top-picked-leagues-by-players';
import { getTopPickedLeagueByPlayers } from '@/lib/supabase/queries/charts';

export default async function PlayerTopLeaguePage() {
  const data = await getTopPickedLeagueByPlayers();

  return <TopPickedLeaguesByPlayersChart data={data} />;
}
