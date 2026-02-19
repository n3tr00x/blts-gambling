import { createClient } from '@/lib/supabase/server';
import { convertKeysToCamel } from '@/lib/utilities/snake-to-camel';
import {
  EditableRound,
  League,
  MatchdayForSelection,
  PlayedRound,
  Player,
  RoundDetails,
  RoundType,
} from '@/lib/supabase/database';

export const getLatestRound = async () => {
  const supabase = await createClient();

  const { data: latestRound, error } = await supabase
    .from('matchdays')
    .select('*')
    .order('round_number', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw error;
  }

  return convertKeysToCamel(latestRound);
};

export const getRoundTypes = async () => {
  const supabase = await createClient();

  const { data: roundTypes, error } = await supabase.from('round_types').select('*');

  if (error) {
    throw error;
  }

  return convertKeysToCamel(roundTypes) as RoundType[];
};

export const getLeagues = async () => {
  const supabase = await createClient();

  const { data: leagues, error } = await supabase.from('leagues').select('*');

  if (error) {
    throw error;
  }

  return convertKeysToCamel(leagues) as League[];
};

export const getPlayers = async () => {
  const supabase = await createClient();

  const { data: players, error } = await supabase.from('players').select('*');

  if (error) {
    throw error;
  }

  return convertKeysToCamel(players) as Player[];
};

export const getMatchdaysForSelection = async () => {
  const supabase = await createClient();

  const { data: matchdays, error } = await supabase
    .from('all_matchdays_for_selection')
    .select('*')
    .is('related_matchday_id', null)
    .order('round_number', { ascending: false });

  if (error) {
    throw error;
  }

  return convertKeysToCamel(matchdays) as MatchdayForSelection[];
};

export const getPlayedRounds = async ({
  page,
  roundsPerPage,
}: {
  page: number;
  roundsPerPage: number;
}) => {
  const supabase = await createClient();

  const from = (page - 1) * roundsPerPage;
  const to = from + roundsPerPage - 1;

  const {
    data: rounds,
    error,
    count,
  } = await supabase
    .rpc('get_played_rounds', undefined, { count: 'exact' })
    .select('*')
    .order('round_number', { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    data: convertKeysToCamel(rounds) as PlayedRound[],
    count: count ?? 0,
  };
};

export const getRoundByMatchdayId = async (matchdayId: string) => {
  const supabase = await createClient();

  const { data: round, error } = await supabase
    .rpc('get_round', {
      p_matchday_id: +matchdayId,
    })
    .select('*')
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }

    throw new Error(error.message);
  }

  return convertKeysToCamel(round) as RoundDetails;
};

export const getRoundForEdit = async (matchdayId: string) => {
  const supabase = await createClient();

  const { data: round, error } = await supabase
    .rpc('get_round_for_edit', { p_matchday_id: +matchdayId })
    .select('*')
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }

    throw new Error(error.message);
  }

  return convertKeysToCamel(round) as EditableRound;
};
