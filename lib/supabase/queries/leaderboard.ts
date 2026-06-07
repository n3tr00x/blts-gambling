import {
  RankingByMonth,
  RankingBySeason,
  SeasonWithCurrent,
} from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/server';
import { convertKeysToCamel } from '@/lib/utilities/snake-to-camel';

export const getRankingBySeason = async (seasonId: number) => {
  const supabase = await createClient();

  let query = supabase.rpc(
    'get_player_ranking_by_season',
    seasonId ? { season_id: seasonId } : undefined,
  );

  // Dla sezonu 1 sortuj po hit_picks, dla sezonu 2+ sortuj najpierw po points
  if (seasonId === 1) {
    query = query
      .order('hit_picks', { ascending: false })
      .order('avg_odds', { ascending: false });
  } else {
    query = query
      .order('points', { ascending: false })
      .order('hit_picks', { ascending: false })
      .order('avg_odds', { ascending: false });
  }

  const { data: ranking, error } = await query;

  if (error) {
    throw error;
  }

  return convertKeysToCamel(ranking) as RankingBySeason[];
};

export const getRankingByMonth = async (month: string) => {
  const supabase = await createClient();

  const parsedDate = new Date(`${month.split('-')[1]}-${month.split('-')[0]}-01`)
    .toISOString()
    .split('T')[0];

  const { data: searchedSeason, error: searchedSeasonError } = await supabase
    .from('seasons')
    .select('id')
    .lte('start_date', parsedDate)
    .gte('end_date', parsedDate)
    .limit(1)
    .single();

  if (searchedSeasonError || !searchedSeason) {
    console.error(
      'Błąd podczas wyszukiwania sezonu dla miesiąca:',
      searchedSeasonError.message,
    );
    throw searchedSeasonError;
  }

  let query = supabase.rpc('get_player_ranking_by_month', month ? { month } : undefined);

  if (searchedSeason.id === 1) {
    query = query
      .order('hit_picks', { ascending: false })
      .order('avg_odds', { ascending: false });
  } else {
    query = query
      .order('points', { ascending: false })
      .order('hit_picks', { ascending: false })
      .order('avg_odds', { ascending: false });
  }

  const { data: ranking, error } = await query;

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
