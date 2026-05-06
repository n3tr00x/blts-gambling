drop view if exists "public"."league_pick_stats_view";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_highest_hit_rate_leagues_by_players(season_id integer DEFAULT NULL::integer, min_picks integer DEFAULT 15)
 RETURNS TABLE(player text, league text, country text, pick_count integer, hit_picks integer)
 LANGUAGE sql
AS $function$
  WITH selected_season AS (
    SELECT COALESCE(
      season_id,
      (SELECT id FROM seasons_with_current WHERE is_current = true LIMIT 1),
      (SELECT id FROM seasons ORDER BY start_date DESC LIMIT 1)
    ) AS season_to_use
  )
  SELECT DISTINCT ON (p.id)
    p.username AS player,
    l.name AS league,
    l.country AS country,
    COUNT(*) AS pick_count,
    COUNT(CASE WHEN pk.is_hit THEN 1 END) AS hit_picks
  FROM picks pk
  JOIN leagues l ON pk.league_id = l.id
  JOIN players p ON pk.player_id = p.id
  WHERE pk.season_id = (SELECT season_to_use FROM selected_season)
  GROUP BY p.id, p.username, l.id, l.name, l.country
  HAVING COUNT(*) >= min_picks
  ORDER BY p.id, (COUNT(CASE WHEN pk.is_hit THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) DESC;
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



