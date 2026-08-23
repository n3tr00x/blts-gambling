drop view if exists "public"."all_matchdays_for_selection";

drop view if exists "public"."league_pick_stats_view";

drop view if exists "public"."matchday_months";

alter table "public"."players" alter column "created_at" set not null;

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


create or replace view "public"."matchday_months" as  SELECT to_char(date_trunc('month'::text, (match_date)::timestamp with time zone), 'MM-YYYY'::text) AS month_key,
    count(*) AS matchdays_count
   FROM public.matchdays
  GROUP BY (date_trunc('month'::text, (match_date)::timestamp with time zone))
  ORDER BY (date_trunc('month'::text, (match_date)::timestamp with time zone)) DESC;


CREATE OR REPLACE FUNCTION public.players_effectiveness_progress(season_id integer DEFAULT NULL::integer)
 RETURNS TABLE(round_number integer, data jsonb)
 LANGUAGE sql
AS $function$
WITH active_season AS (
    SELECT COALESCE(
      season_id,
      (
        SELECT id
        FROM seasons
        WHERE CURRENT_DATE BETWEEN start_date AND end_date
        ORDER BY start_date DESC
        LIMIT 1
      )
    ) AS id
),
all_rounds AS (
    SELECT DISTINCT m.round_number
    FROM matchdays m
    WHERE m.season_id = (SELECT id FROM active_season)
    ORDER BY m.round_number
),
all_players AS (
    SELECT DISTINCT p.username
    FROM players p
),
player_round_stats AS (
    SELECT 
        m.round_number,
        p.username,
        COUNT(*) AS total_picks,
        SUM(CASE WHEN pk.is_hit THEN 1 ELSE 0 END) AS hit_picks
    FROM picks pk
    JOIN players p ON pk.player_id = p.id
    JOIN matchdays m ON pk.matchday_id = m.id
    WHERE m.season_id = (SELECT id FROM active_season)
    GROUP BY m.round_number, p.username
),
all_combinations AS (
    SELECT 
        ar.round_number,
        ap.username
    FROM all_rounds ar
    CROSS JOIN all_players ap
),
player_round_with_nulls AS (
    SELECT 
        ac.round_number,
        ac.username,
        COALESCE(prs.total_picks, 0) AS total_picks,
        COALESCE(prs.hit_picks, 0) AS hit_picks
    FROM all_combinations ac
    LEFT JOIN player_round_stats prs ON ac.round_number = prs.round_number AND ac.username = prs.username
),
cumulative_stats AS (
    SELECT 
        prwn.username,
        prwn.round_number,
        SUM(prwn.hit_picks) OVER (PARTITION BY prwn.username ORDER BY prwn.round_number) AS cumulative_hits,
        SUM(prwn.total_picks) OVER (PARTITION BY prwn.username ORDER BY prwn.round_number) AS cumulative_total
    FROM player_round_with_nulls prwn
)
SELECT 
    c.round_number,
    jsonb_object_agg(c.username, ROUND((c.cumulative_hits::DECIMAL / NULLIF(c.cumulative_total, 0)) * 100, 2)) AS data
FROM cumulative_stats c
GROUP BY c.round_number
ORDER BY c.round_number;
$function$
;


