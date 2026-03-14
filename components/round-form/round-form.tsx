'use client';

import { useFormContext } from 'react-hook-form';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

import { AddPicksForm } from '@/components/round-form/add-picks-form';
import { RoundPrimaryInfo } from '@/components/round-form/round-primary-info';
import { VotesFormTable } from '@/components/round-form/votes';
import { createRound, updateRound } from '@/lib/supabase/actions/round';
import { League, MatchdayForSelection, Player, RoundType } from '@/lib/supabase/database';
import { NewRoundValues } from '@/schemas';

type NewRoundContainerProps = {
  matchdayId?: string;
  isEdit?: boolean;
  players: Player[];
  leagues: League[];
  matchdays: MatchdayForSelection[];
  roundTypes: RoundType[];
};

export function RoundForm({
  matchdayId,
  isEdit,
  players,
  leagues,
  matchdays,
  roundTypes,
}: NewRoundContainerProps) {
  const { handleSubmit, watch } = useFormContext<NewRoundValues>();

  console.log('form state', watch());

  const submitHandler = async (data: NewRoundValues) => {
    const shouldUpdate = isEdit && matchdayId;
    // prettier-ignore
    const action = shouldUpdate 
      ? updateRound(matchdayId, data) 
      : createRound(data);
    const result = await action;

    if (result.status === 'error') {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    redirect('/rounds');
  };

  return (
    <form id="new-round-form" onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-2 gap-4">
        <RoundPrimaryInfo roundTypes={roundTypes} matchdays={matchdays} />
        <AddPicksForm players={players} leagues={leagues} />
        <div className="col-span-2">
          <VotesFormTable players={players} />
        </div>
      </div>
    </form>
  );
}
