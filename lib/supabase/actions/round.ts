'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { NewRoundValues, newRoundValues } from '@/schemas';
import { formatDateToISO } from '@/lib/utilities/date';
import { ActionState } from '@/types';

export const createRound = async (values: NewRoundValues) => {
  const supabase = await createClient();
  const result = newRoundValues.safeParse(values);

  if (!result.success) {
    return {
      status: 'error',
      message: result.error.message,
    };
  }

  const round = result.data;
  const parsedDate = formatDateToISO(round.roundDate);

  const { error } = await supabase.rpc('add_round', {
    p_round_type_id: round.roundTypeId,
    p_round_date: parsedDate,
    p_related_matchday_id: round.relatedMatchdayId,
    p_is_hit: round.isHit,
    p_picks: round.picks,
    p_votes: round.votes,
  });

  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  revalidatePath('/rounds');

  return {
    status: 'success',
    message: 'Pomyślnie dodano rundę',
  };
};

export const updateRound = async (matchdayId: string, values: NewRoundValues) => {
  const supabase = await createClient();
  const result = newRoundValues.safeParse(values);

  if (!result.success) {
    return {
      status: 'error',
      message: result.error.message,
    };
  }

  const { roundTypeId, roundDate, isHit, picks, votes } = result.data;
  const parsedDate = formatDateToISO(roundDate);

  const { error } = await supabase.rpc('update_round', {
    p_matchday_id: +matchdayId,
    p_round_type_id: roundTypeId,
    p_round_date: parsedDate,
    p_is_hit: isHit,
    p_picks: picks,
    p_votes: votes,
  });

  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  revalidatePath('/rounds');

  return {
    status: 'success',
    message: 'Pomyślnie zaktualizowano rundę',
  };
};

export const removeRound = async (matchdayId: number) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc('delete_round', {
    p_matchday_id: matchdayId,
  });

  if (error) {
    return {
      status: 'error',
      message: 'Nie można usunąć rundy, która jest powiązana z innymi danymi',
    } as ActionState;
  }

  revalidatePath('/rounds');

  return {
    status: 'success',
    message: 'Pomyślnie usunięto rundę',
  } as ActionState;
};
