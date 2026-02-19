import { RoundDateField } from '@/components/round-form/fields/round-date-field';
import { RoundHitField } from '@/components/round-form/fields/round-hit-field';
import { RoundMatchdaysSelect } from '@/components/round-form/fields/round-matchdays-select';
import { RoundTypeSelect } from '@/components/round-form/fields/round-type-select';
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field';
import { MatchdayForSelection, RoundType } from '@/lib/supabase/database';

type RoundPrimaryInfoProps = {
  roundTypes: RoundType[];
  matchdays: MatchdayForSelection[];
};

export function RoundPrimaryInfo({ roundTypes, matchdays }: RoundPrimaryInfoProps) {
  return (
    <FieldSet className="border p-4">
      <FieldLegend>Podstawowe informacje o nowej rundzie</FieldLegend>
      <FieldDescription>Wybierz typ oraz datę rozegrania kuponu</FieldDescription>
      <RoundTypeSelect roundTypes={roundTypes} />
      <RoundMatchdaysSelect matchdays={matchdays} />
      <RoundDateField />
      <RoundHitField />
    </FieldSet>
  );
}
