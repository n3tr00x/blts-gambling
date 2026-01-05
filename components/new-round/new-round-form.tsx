'use client';

import { useFormContext } from 'react-hook-form';

import { AddPicksForm } from '@/components/new-round/add-picks-form';
import { VotesFormTable } from '@/components/new-round/votes';
import { Tables } from '@/lib/supabase/database/database.generated';
import { NewRoundValues } from '@/schemas';

import { RoundPrimaryInfo } from '../round-primary-info';

type NewRoundContainerProps = {
  players: Tables<'players'>[];
  leagues: Tables<'leagues'>[];
  roundTypes: Tables<'round_types'>[];
};

export function NewRoundForm({ players, leagues, roundTypes }: NewRoundContainerProps) {
  const { handleSubmit } = useFormContext<NewRoundValues>();

  const submitHandler = async (data: NewRoundValues) => {
    console.log(data);
  };

  return (
    <form id="new-round-form" onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-2 gap-4">
        <RoundPrimaryInfo roundTypes={roundTypes} />
        <AddPicksForm players={players} leagues={leagues} />
        <div className="col-span-2">
          <VotesFormTable players={players} />
        </div>
      </div>
    </form>
  );
}
