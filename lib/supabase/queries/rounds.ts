import { createClient } from '@/lib/supabase/server';
import { RoundDetails } from '@/lib/supabase/database';

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

export const getRoundByMatchdayId = async (matchdayId: string) => {
  const supabase = await createClient();

  const { data: round, error } = await supabase
    .rpc('get_round', {
      matchday_id: +matchdayId,
    })
    .select('*')
    .limit(1)
    .single()
    .overrideTypes<RoundDetails>();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }

    throw new Error(error.message);
  }

  return round;
};
