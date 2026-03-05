import {
  LeagueEffectiveness,
  OddsByRound,
  PlayersEffectivenessProgress,
  PlayerStatsSummary,
  TopPickedLeague,
} from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/server';
import { convertKeysToCamel } from '@/lib/utilities';

export const getPlayersOddsByRound = async (limit: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc('players_odds_by_round')
    .select('*')
    .order('round_number', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return convertKeysToCamel(data) as OddsByRound[];
};

export async function getTopPickedLeagues(limit: number) {
  const supabase = await createClient();
  const { data: leagues, error } = await supabase
    .from('league_pick_stats_view')
    .select('*')
    .order('pick_count', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return convertKeysToCamel(leagues) as TopPickedLeague[];
}

export const getPlayersEffectivenessProgress = async (limit: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc('players_effectiveness_progress')
    .select('*')
    .order('round_number', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return convertKeysToCamel(data) as PlayersEffectivenessProgress[];
};

export async function getPlayerStatsSummary() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('player_stats_by_season').select('*');

  if (error) {
    throw error;
  }

  return convertKeysToCamel(data) as PlayerStatsSummary[];
}

export async function getLeagueEffectiveness(limit: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('league_pick_stats_view')
    .select('*')
    .gte('pick_count', 10)
    .limit(limit);

  if (error) {
    throw error;
  }

  return convertKeysToCamel(data) as LeagueEffectiveness[];
}
