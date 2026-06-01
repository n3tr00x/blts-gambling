drop view if exists "public"."all_matchdays_for_selection";

drop view if exists "public"."league_pick_stats_view";

drop view if exists "public"."matchday_months";

set check_function_bodies = off;

create or replace view "public"."all_matchdays_for_selection" as  SELECT m.id,
    m.season_id,
    m.round_number,
    m.match_date,
    m.correct,
    m.related_matchday_id,
    rt.name AS round_type
   FROM (public.matchdays m
     JOIN public.round_types rt ON ((rt.id = m.round_type_id)));


CREATE OR REPLACE FUNCTION public.get_top_picked_leagues(season_id integer DEFAULT NULL::integer)
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
      JOIN picks p ON p.league_id = l.id
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
    ls.pick_count DESC;
$function$
;

create or replace view "public"."league_pick_stats_view" as  WITH league_stats AS (
         SELECT p.season_id,
            s.name AS season_name,
            l.id,
            l.name AS league_name,
            l.country,
            l.level,
            count(p.id) AS pick_count,
            count(*) FILTER (WHERE (p.is_hit = true)) AS hit_count
           FROM ((public.leagues l
             JOIN public.picks p ON ((p.league_id = l.id)))
             JOIN public.seasons s ON ((s.id = p.season_id)))
          GROUP BY p.season_id, s.name, l.id, l.name, l.country, l.level
        ), total AS (
         SELECT league_stats.season_id,
            sum(league_stats.pick_count) AS total_picks
           FROM league_stats
          GROUP BY league_stats.season_id
        )
 SELECT ls.season_id,
    ls.league_name,
    ls.country,
    ls.level,
    ls.pick_count,
    ls.hit_count,
    t.total_picks
   FROM (league_stats ls
     JOIN total t ON ((t.season_id = ls.season_id)))
  WHERE (ls.pick_count > 0)
  ORDER BY ls.season_id DESC, ls.pick_count DESC;


create or replace view "public"."matchday_months" as  SELECT to_char(date_trunc('month'::text, (match_date)::timestamp with time zone), 'MM-YYYY'::text) AS month_key,
    count(*) AS matchdays_count
   FROM public.matchdays
  GROUP BY (date_trunc('month'::text, (match_date)::timestamp with time zone))
  ORDER BY (date_trunc('month'::text, (match_date)::timestamp with time zone)) DESC;



