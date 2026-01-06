'use client';

import { FormProvider } from 'react-hook-form';

import { RoundCardTitleContent } from '@/components/round-form/round-card-title-content';
import { RoundForm } from '@/components/round-form/round-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRoundForm } from '@/hooks/useRoundForm';
import { EditableRound } from '@/lib/supabase/database';
import { Tables } from '@/lib/supabase/database/database.generated';

type NewRoundCardProps = {
  round?: EditableRound;
  latestRound?: Pick<Tables<'matchdays'>, 'round_number'> | null;
  players: Tables<'players'>[];
  leagues: Tables<'leagues'>[];
  roundTypes: Tables<'round_types'>[];
};

export function RoundCard({ round, leagues, players, roundTypes }: NewRoundCardProps) {
  const { methods, isEditMode, isValid, isSubmitting } = useRoundForm({ round, players });

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader>
          <CardTitle className="font-secondary text-2xl tracking-wide">
            <RoundCardTitleContent
              isEditMode={isEditMode}
              roundDate={round?.roundDate}
              roundNumber={round?.roundNumber}
            />
          </CardTitle>
          <CardAction>
            <Button type="submit" id="new-round-form" disabled={!isValid || isSubmitting}>
              {isEditMode ? 'Zapisz zmiany' : 'Dodaj rundę'}
            </Button>
          </CardAction>
          <CardDescription>
            {isEditMode
              ? 'Edytujesz istniejącą rundę.'
              : 'Tutaj możesz dodać nową rundę.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoundForm players={players} leagues={leagues} roundTypes={roundTypes} />
        </CardContent>
      </Card>
    </FormProvider>
  );
}
