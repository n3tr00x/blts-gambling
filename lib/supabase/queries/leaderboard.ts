import { createClient } from '@/lib/supabase/server';
import { SeasonWithCurrent } from '@/lib/supabase/database';

export const getRankingBySeason = async (seasonId: number) => {
  const supabase = await createClient();

  const { data: ranking, error } = await supabase.rpc(
    'player_ranking_by_season',
    seasonId ? { season_id: seasonId } : undefined,
  );

  if (error) {
    throw error;
  }

  return ranking ?? [];
};

export const getRankingByMonth = async (month: string) => {
  const supabase = await createClient();

  const { data: ranking, error } = await supabase.rpc(
    'player_ranking_by_month',
    month ? { month } : undefined,
  );

  if (error) {
    throw error;
  }

  return ranking ?? [];
};

export const getAllSeasons = async () => {
  const supabase = await createClient();

  const { data: seasons, error } = await supabase
    .from('seasons_with_current')
    .select('*')
    .overrideTypes<Array<SeasonWithCurrent>>();

  if (error) {
    throw error;
  }

  return seasons ?? [];
};
