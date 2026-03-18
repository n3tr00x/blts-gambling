import {
  Database as DatabaseGenerated,
  Tables,
} from '@/lib/supabase/database/database.generated';
import { Flatten, Merge, NonNullableProps, SnakeToCamelCase } from '@/types';

export type { Json } from '@/lib/supabase/database/database.generated';

export type Database = DatabaseGenerated;

export type DbTable<
  T extends keyof Database['public']['Tables'] | keyof Database['public']['Views'],
> = SnakeToCamelCase<Tables<T>>;

export type DbTableWithNonNullable<
  T extends keyof Database['public']['Tables'] | keyof Database['public']['Views'],
> = SnakeToCamelCase<NonNullableProps<Tables<T>>>;

export type DbFunction<T extends keyof Database['public']['Functions']> =
  SnakeToCamelCase<Database['public']['Functions'][T]['Returns']>;

export type SeasonWithCurrent = DbTableWithNonNullable<'seasons_with_current'>;

export type MatchdayMonth = DbTableWithNonNullable<'matchday_months'>;

export type MatchdayForSelection = DbTableWithNonNullable<'all_matchdays_for_selection'>;

export type RoundType = DbTable<'round_types'>;

export type League = DbTable<'leagues'>;

export type Player = DbTable<'players'>;

export type PlayedRound = DbFunction<'get_played_rounds'>[0];

export type RoundResult = {
  correct: boolean;
  id: number;
  matchDate: string;
  roundNumber: number;
  roundType: string;
  seasonName: string;
};

type RoundPickDetails = {
  odd: number;
  isHit: boolean;
  isChosen: boolean;
  league: { id: number; name: string; country: string };
  player: { id: number; username: string };
};

type RoundVoteDetails = {
  voter: { id: number; username: string };
  votesFor: { id: number; username: string }[];
};

export type RoundDetails = Merge<
  DbFunction<'get_round'>[0],
  {
    picks: RoundPickDetails[];
    votes: RoundVoteDetails[];
  }
>;

type EditablePickInRound = {
  odd: number;
  playerId: number;
  leagueId: number;
  isHit: boolean;
  isChosen: boolean;
};

type EditableVoteInRound = {
  voterId: number;
  votesFor: number[];
};

export type EditableRound = Merge<
  DbFunction<'get_round_for_edit'>[0],
  { picks: EditablePickInRound[]; votes: EditableVoteInRound[] }
>;

export type OddsByRound = Merge<
  DbFunction<'players_odds_by_round'>[0],
  { data: Record<string, number> }
>;

export type FlattenedOddsByRound = Flatten<OddsByRound, 'data', 'roundNumber'>;

export type TopPickedLeague = DbTableWithNonNullable<'league_pick_stats_view'>;

export type PlayersEffectivenessProgress = Merge<
  DbFunction<'players_effectiveness_progress'>[0],
  { data: Record<string, number> }
>;

export type FlattenedPlayersEffectivenessProgress = Flatten<
  PlayersEffectivenessProgress,
  'data',
  'roundNumber'
>;

export type PlayerStatsSummary = DbFunction<'player_stats_by_season'>[0];

export type LeagueEffectiveness = DbTableWithNonNullable<'league_pick_stats_view'>;

export type RankingBySeason = DbFunction<'get_player_ranking_by_season'>[0];

export type RankingByMonth = DbFunction<'get_player_ranking_by_month'>[0];

export type Season = DbTableWithNonNullable<'seasons_with_current'>;
