import { RoundDateField } from '@/components/round-form/fields/round-date-field';
import { RoundHitField } from '@/components/round-form/fields/round-hit-field';
import { RoundTypeSelect } from '@/components/round-form/fields/round-type-select';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Tables } from '@/lib/supabase/database/database.generated';

type RoundPrimaryInfoProps = { roundTypes: Tables<'round_types'>[] };

export function RoundPrimaryInfo({ roundTypes }: RoundPrimaryInfoProps) {
  return (
    <FieldSet className="border p-4">
      <FieldLegend>Podstawowe informacje o nowej rundzie</FieldLegend>
      <FieldDescription>Wybierz typ oraz datę rozegrania kuponu</FieldDescription>
      <FieldGroup>
        <Field>
          <RoundTypeSelect roundTypes={roundTypes} />
        </Field>
        <Field>
          <RoundDateField />
        </Field>
        <Field>
          <RoundHitField />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
