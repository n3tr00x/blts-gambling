'use client';

import { useMemo } from 'react';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { NewRoundForm } from '@/components/new-round/new-round-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tables } from '@/lib/supabase/database/database.generated';
import { NewRoundValues, newRoundValues } from '@/schemas';

type NewRoundCardProps = {
  players: Tables<'players'>[];
  leagues: Tables<'leagues'>[];
  roundTypes: Tables<'round_types'>[];
  latestRound: Pick<Tables<'matchdays'>, 'round_number'> | null;
};

export function NewRoundCard({
  leagues,
  players,
  roundTypes,
  latestRound,
}: NewRoundCardProps) {
  const DEFAULT_VALUES = useMemo<DefaultValues<NewRoundValues>>(
    () => ({
      roundTypeId: undefined,
      roundDate: undefined,
      isHit: false,
      votes: players.map(player => ({ voterId: player.id, votesFor: [] })),
      picks: [
        {
          playerId: undefined,
          leagueId: undefined,
          odd: 1,
          isChosen: false,
          isHit: false,
        },
      ],
    }),
    [players],
  );

  const methods = useForm<NewRoundValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(newRoundValues),
  });

  const {
    formState: { isSubmitting, isValid },
  } = methods;

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader>
          <CardTitle className="font-secondary text-2xl tracking-wide">
            Nowa runda ({latestRound ? latestRound.round_number + 1 : 1})
          </CardTitle>
          <CardAction>
            <Button type="submit" id="new-round-form" disabled={!isValid || isSubmitting}>
              Dodaj nową rundę
            </Button>
          </CardAction>
          <CardDescription>
            Tutaj możesz dodać nową rundę. Runda będzie automatycznie inkrementowana o 1 w
            danym sezonie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewRoundForm players={players} leagues={leagues} roundTypes={roundTypes} />
        </CardContent>
      </Card>
    </FormProvider>
  );
}
