import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { NewRoundValues } from '@/schemas';

type PickIsHitFieldProps = {
  index: number;
};

export function PickIsHitField({ index }: PickIsHitFieldProps) {
  const { control } = useFormContext<NewRoundValues>();

  return (
    <Controller
      name={`picks.${index}.isHit`}
      control={control}
      render={({ field }) => (
        <Field className="col-span-1" orientation="horizontal">
          <Checkbox
            id={field.name}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <FieldLabel htmlFor={field.name}>Czy trafione?</FieldLabel>
        </Field>
      )}
    />
  );
}
