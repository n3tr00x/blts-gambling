drop view if exists "public"."league_pick_stats_view";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_league_pick_stats(season_id integer DEFAULT NULL::integer)
 RETURNS TABLE(league_name text, country text, level integer, pick_count bigint, hit_count bigint, total_picks bigint)
 LANGUAGE sql
AS $function$
  WITH selected_season AS (
    SELECT COALESCE(
      season_id,
      (SELECT id FROM seasons_with_current WHERE is_current = true LIMIT 1),
      (SELECT id FROM seasons ORDER BY start_date DESC LIMIT 1)
    ) AS season_to_use
  ),
  league_stats AS (
    SELECT
      l.id,
      l.name AS league_name,
      l.country,
      l.level,
      COUNT(p.id) AS pick_count,
      COUNT(*) FILTER (
        WHERE
          p.is_hit = TRUE
      ) AS hit_count
    FROM
      leagues l
      LEFT JOIN picks p ON p.league_id = l.id 
        AND p.season_id = (SELECT season_to_use FROM selected_season)
    GROUP BY
      l.id,
      l.name,
      l.country,
      l.level
  ),
  total AS (
    SELECT
      SUM(pick_count) AS total_picks
    FROM
      league_stats
  )
  SELECT
    ls.league_name,
    ls.country,
    ls.level,
    ls.pick_count,
    ls.hit_count,
    t.total_picks
  FROM
    league_stats ls
    CROSS JOIN total t
  WHERE
    ls.pick_count > 0
  ORDER BY
    (ls.hit_count::NUMERIC / NULLIF(ls.pick_count::NUMERIC, 0)) DESC,
    ls.pick_count DESC;
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



