import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NewRoundValues } from '@/schemas';

type PickPlayerFieldProps = {
  players: { id: number; username: string }[] | null;
  selectedPlayers: (number | null)[];
  index: number;
};

export function PickPlayerField({
  players,
  selectedPlayers,
  index,
}: PickPlayerFieldProps) {
  const { control, watch } = useFormContext<NewRoundValues>();

  const availablePlayers = players?.filter(
    player =>
      !selectedPlayers.includes(player.id) ||
      player.id === watch(`picks.${index}.playerId`),
  );

  return (
    <Controller
      control={control}
      name={`picks.${index}.playerId`}
      render={({ field, fieldState }) => (
        <Field className="col-span-2 w-1/2" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Gracz</FieldLabel>
          <Select
            {...field}
            value={field.value ? field.value.toString() : ''}
            onValueChange={v => field.onChange(Number(v))}
          >
            <SelectTrigger className="w-1/2" aria-invalid={fieldState.invalid}>
              <SelectValue placeholder="Wybierz gracza" />
            </SelectTrigger>
            <SelectContent id={field.name}>
              {availablePlayers?.map(player => (
                <SelectItem key={player.id} value={player.id.toString()}>
                  {player.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
