import { createClient } from '@/lib/supabase/server';
import { convertKeysToCamel } from '@/lib/utilities/snake-to-camel';
import { EditableRound, PlayedRound } from '@/lib/supabase/database';

export const getLatestRound = async () => {
  const supabase = await createClient();

  const { data: latestRound } = await supabase
    .from('matchdays')
    .select('*')
    .order('round_number', { ascending: false })
    .limit(1)
    .single();

  return latestRound;
};

export const getRoundTypes = async () => {
  const supabase = await createClient();

  const { data: roundTypes } = await supabase.from('round_types').select('*');

  return roundTypes ?? [];
};

export const getLeagues = async () => {
  const supabase = await createClient();

  const { data: leagues } = await supabase.from('leagues').select('*');

  return leagues ?? [];
};

export const getPlayers = async () => {
  const supabase = await createClient();

  const { data: players } = await supabase.from('players').select('*');

  return players ?? [];
};

export const getMatchdays = async () => {
  const supabase = await createClient();

  const { data: matchdays } = await supabase
    .from('matchdays')
    .select(
      `
        id,   
        round_number,
        match_date,        
        round_types (id, name)
      `,
    )
    .is('related_matchday_id', null)
    .order('round_number', { ascending: false });

  return matchdays ?? [];
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
  // .overrideTypes<RoundDetails>();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }

    throw new Error(error.message);
  }

  return round;
};

export const getRoundForEdit = async (matchdayId: string) => {
  const supabase = await createClient();

  const { data: round, error } = await supabase
    .rpc('get_round_for_edit', { p_matchday_id: +matchdayId })
    .select('*')
    .limit(1)
    .single()
    .overrideTypes<EditableRound>();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }

    throw new Error(error.message);
  }

  return round;
};
