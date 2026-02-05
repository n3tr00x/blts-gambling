import {
  Database as DatabaseGenerated,
  Tables,
} from '@/lib/supabase/database/database.generated';
import { NonNullableProps, SnakeToCamelCase } from '@/types';

export type { Json } from '../database/database.generated';

export type Database = DatabaseGenerated;

export type SeasonWithCurrent = NonNullableProps<Tables<'seasons_with_current'>>;

export type MatchdayMonth = NonNullableProps<Tables<'matchday_months'>>;

export type PlayedRound = SnakeToCamelCase<
  Database['public']['Functions']['get_played_rounds']['Returns'][0]
>;

// export type RoundDetails = {
//   roundNumber: number;
//   roundType: string;
//   roundDate: string;
//   isHit: boolean;
//   season: string;
//   relatedMatchdayId: number | null;
//   picks: {
//     isChosen: boolean;
//     isHit: boolean;
//     odd: number;
//     player: { id: number; username: string };
//     league: { id: number; name: string; country: string };
//   }[];
//   votes: {
//     voter: { id: number; username: string };
//     votesFor: { id: number; username: string }[];
//   }[];
// };

export type EditableRound = {
  roundTypeId: number;
  roundDate: string;
  roundNumber: number;
  isHit: boolean;
  relatedMatchdayId: number | null;
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

export type RoundResult = {
  correct: boolean;
  id: number;
  matchDate: string;
  roundNumber: number;
  roundType: string;
  seasonName: string;
};
