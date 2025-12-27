import {
  Database as DatabaseGenerated,
  Tables,
} from '@/lib/supabase/database/database.generated';
import { NonNullableProps } from '@/types';

export type { Json } from '../database/database.generated';

export type Database = DatabaseGenerated;

export type SeasonWithCurrent = NonNullableProps<Tables<'seasons_with_current'>>;

export type MatchdayMonth = NonNullableProps<Tables<'matchday_months'>>;

export type RoundDetails = Database['public']['Functions']['get_round']['Returns'][0] & {
  picks: {
    is_chosen: boolean;
    is_hit: boolean;
    odd: number;
    player: Tables<'players'>;
    league: { id: number; name: string; country: string };
  }[];
} & {
  votes: {
    voter: Tables<'players'>;
    votes_for: Tables<'players'>[];
  }[];
};

export type RoundResult =
  Database['public']['Functions']['get_played_rounds']['Returns'][number];
