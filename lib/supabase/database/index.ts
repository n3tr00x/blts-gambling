import {
  Database as DatabaseGenerated,
  Tables,
} from '@/lib/supabase/database/database.generated';
import { NonNullableProps } from '@/types';

export type { Json } from '../database/database.generated';

export type Database = DatabaseGenerated;

export type SeasonWithCurrent = NonNullableProps<Tables<'seasons_with_current'>>;

export type MatchdayMonth = NonNullableProps<Tables<'matchday_months'>>;
