import { EditableRound } from '@/lib/supabase/database';
import { Tables } from '@/lib/supabase/database/database.generated';
import { newRoundValues, NewRoundValues } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';

const getDefaultValues = (
  players: Tables<'players'>[],
  editableRound?: EditableRound,
): DefaultValues<NewRoundValues> => {
  const { roundTypeId, roundDate, isHit, picks, votes } = editableRound || {};

  const defaultVotesValue = players.map(player => ({
    voterId: player.id,
    votesFor: [] as number[],
  }));

  const editableVotes = players.map(player => {
    const vote = votes?.find(vote => vote?.voterId === player.id);
    return vote ?? { voterId: player.id, votesFor: [] };
  });

  const defaultPicksValue = [
    {
      player_id: undefined,
      leagueId: undefined,
      odd: 1,
      isChosen: false,
      isHit: false,
    },
  ];

  return {
    roundTypeId: roundTypeId ?? undefined,
    roundDate: roundDate ? new Date(roundDate) : undefined,
    isHit: isHit ?? false,
    votes: editableVotes ?? defaultVotesValue,
    picks: picks ?? defaultPicksValue,
  };
};

type UseRoundFormArgs = {
  round?: EditableRound;
  players: Tables<'players'>[];
};

export const useRoundForm = ({ round, players }: UseRoundFormArgs) => {
  const isEditMode = Boolean(round);

  const defaultValues = useMemo<DefaultValues<NewRoundValues>>(
    () => getDefaultValues(players, round),
    [round, players],
  );

  const methods = useForm<NewRoundValues>({
    resolver: zodResolver(newRoundValues),
    defaultValues,
    mode: 'onChange',
  });

  const {
    formState: { isSubmitting, isValid, isDirty },
  } = methods;

  return {
    methods,
    isEditMode,
    isSubmitting,
    isValid,
    isDirty,
  };
};
