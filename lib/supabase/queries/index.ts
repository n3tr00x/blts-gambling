import { createClient } from '../server';

export * from './leaderboard';

export const getRoundByMatchdayId = async (matchdayId: string) => {
  const supabase = await createClient();

  const { data: round, error } = await supabase
    .rpc('get_round_for_edit', { p_matchday_id: matchdayId })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return round ?? null;
};
