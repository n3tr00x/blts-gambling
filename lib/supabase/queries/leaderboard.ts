import {
  RankingByMonth,
  RankingBySeason,
  SeasonWithCurrent,
} from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/server';
import { convertKeysToCamel } from '@/lib/utilities/snake-to-camel';

export const getRankingBySeason = async (seasonId: number) => {
  const supabase = await createClient();

  const { data: ranking, error } = await supabase.rpc(
    'get_player_ranking_by_season',
    seasonId ? { season_id: seasonId } : undefined,
  );

  if (error) {
    throw error;
  }

  return convertKeysToCamel(ranking) as RankingBySeason[];
};

export const getRankingByMonth = async (month: string) => {
  const supabase = await createClient();

  const { data: ranking, error } = await supabase.rpc(
    'get_player_ranking_by_month',
    month ? { month } : undefined,
  );

  console.log(ranking);

  if (error) {
    throw error;
  }

  return convertKeysToCamel(ranking) as RankingByMonth[];
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

  return convertKeysToCamel(seasons) as SeasonWithCurrent[];
};

export const getMatchdayMonths = async () => {
  const supabase = await createClient();
  const { data: months, error } = await supabase.from('matchday_months').select('*');

  if (error) {
    throw error;
  }

  return convertKeysToCamel(months) as { monthKey: string; matchdaysCount: number }[];
};
