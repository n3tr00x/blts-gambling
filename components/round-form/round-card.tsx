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
import { useRoundForm } from '@/hooks/use-round-form';
import {
  EditableRound,
  League,
  MatchdayForSelection,
  Player,
  RoundType,
} from '@/lib/supabase/database';

type RoundCardProps = {
  matchdayId?: string;
  round?: EditableRound;
  matchdays: MatchdayForSelection[];
  leagues: League[];
  players: Player[];
  roundTypes: RoundType[];
};

export function RoundCard({
  matchdayId,
  round,
  matchdays,
  leagues,
  players,
  roundTypes,
}: RoundCardProps) {
  const { methods, isEditMode, isValid, isSubmitting, isDirty } = useRoundForm({
    round,
    players,
  });

  const disabled = !isValid || isSubmitting || (isEditMode && !isDirty);

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
            <Button type="submit" form="new-round-form" disabled={disabled}>
              {isEditMode ? 'Zapisz zmiany' : 'Dodaj rundę'}
            </Button>
          </CardAction>
          <CardDescription>
            {isEditMode ?
              'Edytujesz istniejącą rundę.'
            : 'Tutaj możesz dodać nową rundę.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoundForm
            matchdayId={matchdayId}
            isEdit={isEditMode}
            matchdays={matchdays}
            players={players}
            leagues={leagues}
            roundTypes={roundTypes}
          />
        </CardContent>
      </Card>
    </FormProvider>
  );
}
