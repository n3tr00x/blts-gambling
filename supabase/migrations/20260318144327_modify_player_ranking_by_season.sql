drop function if exists "public"."player_ranking_by_season"(season_id integer);

drop view if exists "public"."league_pick_stats_view";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_player_ranking_by_season(season_id integer DEFAULT NULL::integer)
 RETURNS TABLE("position" integer, username text, hit_picks integer, total_picks integer, effectiveness numeric, avg_odds numeric, total_votes integer)
 LANGUAGE sql
AS $function$
  WITH selected_season AS (
    SELECT COALESCE(
      season_id,
      (SELECT id FROM seasons_with_current WHERE is_current = true LIMIT 1),
      (SELECT id FROM seasons ORDER BY start_date DESC LIMIT 1)
    ) AS season_to_use
  ),
  picks_stats AS (
    SELECT
      pk.player_id,
      COUNT(*) AS total_picks,
      SUM(CASE WHEN pk.is_hit THEN 1 ELSE 0 END) AS hit_picks,
      ROUND(AVG(CASE WHEN pk.is_hit THEN pk.odds END), 2) AS avg_odds_hit
    FROM picks pk
    WHERE pk.season_id = (SELECT season_to_use FROM selected_season)
    GROUP BY pk.player_id
  ),
  votes_stats AS (
    SELECT
      pk.player_id,
      COUNT(v.id) AS total_votes
    FROM picks pk
    LEFT JOIN votes v
      ON v.pick_id = pk.id
    WHERE pk.season_id = (SELECT season_to_use FROM selected_season)
    GROUP BY pk.player_id
  ),
  player_stats AS (
    SELECT
      p.id AS player_id,
      p.username,
      COALESCE(ps.hit_picks, 0) AS hit_picks,
      COALESCE(ps.total_picks, 0) AS total_picks,
      ps.avg_odds_hit AS avg_odds_hit,
      COALESCE(vs.total_votes, 0) AS total_votes
    FROM players p
    LEFT JOIN picks_stats ps ON ps.player_id = p.id
    LEFT JOIN votes_stats vs ON vs.player_id = p.id
  )
  SELECT
    RANK() OVER (
      ORDER BY
        CASE
          WHEN total_picks > 0 THEN (hit_picks::numeric / total_picks)
          ELSE 0
        END DESC,
        hit_picks DESC,
        total_picks DESC,
        username ASC
    ) AS "position",
    username,
    hit_picks,
    total_picks,
    CASE
      WHEN total_picks > 0 THEN ROUND((hit_picks::numeric / total_picks) * 100, 2)
      ELSE 0
    END AS effectiveness,
    avg_odds_hit AS avg_odds,
    total_votes
  FROM player_stats
  ORDER BY "position", username;
$function$
;

create or replace view "public"."league_pick_stats_view" as  WITH league_stats AS (
         SELECT l.id,
            l.name AS league_name,
            l.country,
            l.level,
            count(p.id) AS pick_count,
            count(*) FILTER (WHERE (p.is_hit = true)) AS hit_count
           FROM (public.leagues l
             LEFT JOIN public.picks p ON ((p.league_id = l.id)))
          GROUP BY l.id, l.name, l.country, l.level
        ), total AS (
         SELECT sum(league_stats.pick_count) AS total_picks
           FROM league_stats
        )
 SELECT ls.league_name,
    ls.country,
    ls.level,
    ls.pick_count,
    ls.hit_count,
    t.total_picks
   FROM (league_stats ls
     CROSS JOIN total t)
  WHERE (ls.pick_count > 0)
  ORDER BY ls.pick_count DESC;



