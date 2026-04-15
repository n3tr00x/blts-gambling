drop function if exists "public"."get_played_rounds"();

drop view if exists "public"."league_pick_stats_view";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_played_rounds()
 RETURNS TABLE(id integer, round_number integer, match_date date, round_type text, round_type_id integer, season_name text, season_id integer, correct boolean)
 LANGUAGE sql
AS $function$
SELECT 
    m.id,
    m.round_number,
    m.match_date,
    rt.name AS round_type,
    m.round_type_id,
    s.name AS season_name,
    m.season_id,
    m.correct
FROM matchdays m
JOIN seasons s ON m.season_id = s.id
JOIN round_types rt ON m.round_type_id = rt.id
WHERE m.match_date <= CURRENT_DATE
ORDER BY s.start_date DESC, m.round_number ASC;
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



