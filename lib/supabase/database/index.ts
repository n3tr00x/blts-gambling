import {
  Database as DatabaseGenerated,
  Tables,
} from '@/lib/supabase/database/database.generated';
import { NonNullableProps, SnakeToCamelCase } from '@/types';

export type { Json } from '../database/database.generated';

export type Database = DatabaseGenerated;

export type SeasonWithCurrent = NonNullableProps<Tables<'seasons_with_current'>>;

export type MatchdayMonth = NonNullableProps<Tables<'matchday_months'>>;

export type MatchdayForSelection = SnakeToCamelCase<
  NonNullableProps<Tables<'all_matchdays_for_selection'>>
>;

export type RoundType = SnakeToCamelCase<Tables<'round_types'>>;

export type League = SnakeToCamelCase<Tables<'leagues'>>;

export type Player = SnakeToCamelCase<Tables<'players'>>;

export type PlayedRound = SnakeToCamelCase<
  Database['public']['Functions']['get_played_rounds']['Returns'][0]
>;

export type RoundResult = {
  correct: boolean;
  id: number;
  matchDate: string;
  roundNumber: number;
  roundType: string;
  seasonName: string;
};

export type RoundDetails = SnakeToCamelCase<
  Database['public']['Functions']['get_round']['Returns'][0]
> & {
  picks: {
    odd: number;
    isHit: boolean;
    isChosen: boolean;
    league: { id: number; name: string; country: string };
    player: { id: number; username: string };
  }[];
  votes: {
    voter: { id: number; username: string };
    votesFor: { id: number; username: string }[];
  }[];
};

export type EditableRound = SnakeToCamelCase<
  Database['public']['Functions']['get_round_for_edit']['Returns'][0]
> & {
  picks: {
    playerId: number;
    leagueId: number;
    odd: number;
    isChosen: boolean;
    isHit: boolean;
  }[];
  votes: {
    voterId: number;
    votesFor: number[];
  }[];
};
