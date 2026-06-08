import { useMemo } from 'react';
import { TZDate } from 'react-day-picker';
import { DefaultValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { EditableRound, Player } from '@/lib/supabase/database';
import { NewRoundValues, newRoundValues } from '@/schemas';

const getDefaultValues = (
  players: Player[],
  editableRound?: EditableRound,
): DefaultValues<NewRoundValues> => {
  const { roundTypeId, roundDate, isHit, picks, votes, relatedMatchdayId, couponUrl } =
    editableRound || {};

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
      playerId: undefined,
      leagueId: undefined,
      odd: 1,
      isChosen: false,
      isHit: false,
    },
  ];

  return {
    roundTypeId: roundTypeId ?? undefined,
    relatedMatchdayId: relatedMatchdayId ?? undefined,
    roundDate: roundDate ? new TZDate(roundDate, 'UTC') : undefined,
    isHit: isHit ?? false,
    votes: editableVotes ?? defaultVotesValue,
    picks: picks ?? defaultPicksValue,
    couponUrl: couponUrl ?? undefined,
  };
};

type UseRoundFormArgs = {
  round?: EditableRound;
  players: Player[];
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
