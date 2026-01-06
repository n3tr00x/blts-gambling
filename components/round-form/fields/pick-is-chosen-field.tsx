import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { NewRoundValues } from '@/schemas';

type PickIsChosenFieldProps = {
  index: number;
};

export function PickIsChosenField({ index }: PickIsChosenFieldProps) {
  const { control } = useFormContext<NewRoundValues>();

  return (
    <Controller
      name={`picks.${index}.isChosen`}
      control={control}
      render={({ field }) => (
        <Field className="col-span-1" orientation="horizontal">
          <Checkbox
            id={field.name}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <FieldLabel htmlFor={field.name}>Czy wybrane?</FieldLabel>
        </Field>
      )}
    />
  );
}
