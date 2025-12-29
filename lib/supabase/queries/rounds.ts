import { createClient } from '@/lib/supabase/server';
import { RoundDetails } from '@/lib/supabase/database';

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
