'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { UserXIcon } from 'lucide-react';

import { PickIsChosenField } from '@/components/round-form/fields/pick-is-chosen-field';
import { PickIsHitField } from '@/components/round-form/fields/pick-is-hit-field';
import { PickLeagueField } from '@/components/round-form/fields/pick-league-field';
import { PickOddField } from '@/components/round-form/fields/pick-odd-field';
import { PickPlayerField } from '@/components/round-form/fields/pick-player-field';
import { Button } from '@/components/ui/button';
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Tables } from '@/lib/supabase/database/database.generated';
import { NewRoundValues } from '@/schemas';

type AddPicksFormProps = {
  players: Tables<'players'>[];
  leagues: Tables<'leagues'>[];
};

export function AddPicksForm({ players, leagues }: AddPicksFormProps) {
  const { control, watch } = useFormContext<NewRoundValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'picks',
  });

  const addPickHandler = () => {
    if (!players) {
      return;
    }

    if (fields.length < players.length) {
      append({
        leagueId: 0,
        playerId: 0,
        odd: 1,
        isHit: false,
        isChosen: false,
      });
    }
  };

  const selectedPlayers = watch('picks')
    .map(player => player.playerId)
    .filter(Boolean);

  return (
    <FieldSet className="border p-4">
      <FieldLegend className="text-xl">Informacje o typach graczy</FieldLegend>
      <FieldDescription>
        Wprowadź tutaj dane o wysokości kursu, ligi oraz czy został on wybrany i trafiony
      </FieldDescription>
      {fields.map((field, index) => {
        return (
          <FieldGroup key={field.id} className="relative rounded border p-4">
            <Button
              type="button"
              className="bg-destructive absolute top-4 right-4 w-24 cursor-pointer"
              onClick={() => remove(index)}
            >
              <UserXIcon /> Usuń
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <PickPlayerField
                players={players}
                selectedPlayers={selectedPlayers}
                index={index}
              />
              <PickLeagueField leagues={leagues} index={index} />
              <PickOddField index={index} />
              <PickIsChosenField index={index} />
              <PickIsHitField index={index} />
            </div>
          </FieldGroup>
        );
      })}
      {fields.length < players.length && (
        <Button type="button" onClick={addPickHandler}>
          Dodaj kolejnego gracza
        </Button>
      )}
    </FieldSet>
  );
}
