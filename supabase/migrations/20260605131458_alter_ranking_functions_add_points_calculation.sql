drop view if exists "public"."all_matchdays_for_selection";

drop function if exists "public"."get_player_ranking_by_month"(month text);

drop function if exists "public"."get_player_ranking_by_season"(season_id integer);

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


CREATE OR REPLACE FUNCTION public.get_player_ranking_by_month(month text)
 RETURNS TABLE(username text, hit_picks integer, total_picks integer, effectiveness numeric, avg_odds numeric, total_votes integer, points numeric)
 LANGUAGE sql
AS $function$
  WITH month_data AS (
    SELECT
      TO_DATE(month, 'MM-YYYY') AS month_start,
      (TO_DATE(month, 'MM-YYYY') + INTERVAL '1 month - 1 day')::date AS month_end
  ),
  picks_stats AS (
    SELECT
      pk.player_id,
      COUNT(*) AS total_picks,
      SUM(CASE WHEN pk.is_hit THEN 1 ELSE 0 END) AS hit_picks,
      ROUND(AVG(CASE WHEN pk.is_hit THEN pk.odds END), 2) AS avg_odds_hit,
      ROUND(SUM(CASE WHEN pk.is_hit THEN pk.odds ELSE 0 END), 2) AS sum_odds_hit
    FROM picks pk
    JOIN matchdays m
      ON m.id = pk.matchday_id
    WHERE m.match_date BETWEEN (SELECT month_start FROM month_data)
                          AND (SELECT month_end   FROM month_data)
    GROUP BY pk.player_id
  ),
  month_matchdays_count AS (
    SELECT COUNT(*) AS matchdays_in_month
    FROM matchdays m
    WHERE m.match_date BETWEEN (SELECT month_start FROM month_data)
                          AND (SELECT month_end FROM month_data)
  ),
  votes_stats AS (
    SELECT
      pk.player_id,
      COUNT(v.id) AS total_votes
    FROM picks pk
    JOIN matchdays m
      ON m.id = pk.matchday_id
    LEFT JOIN votes v
      ON v.pick_id = pk.id
    WHERE m.match_date BETWEEN (SELECT month_start FROM month_data)
                          AND (SELECT month_end   FROM month_data)
    GROUP BY pk.player_id
  ),
  player_stats AS (
    SELECT
      p.id AS player_id,
      p.username,
      COALESCE(ps.hit_picks, 0) AS hit_picks,
      COALESCE(ps.total_picks, 0) AS total_picks,
      ps.avg_odds_hit AS avg_odds_hit,
      ps.sum_odds_hit AS sum_odds_hit,
      COALESCE(vs.total_votes, 0) AS total_votes,
      (SELECT matchdays_in_month FROM month_matchdays_count) AS matchdays_count
    FROM players p
    LEFT JOIN picks_stats ps ON ps.player_id = p.id
    LEFT JOIN votes_stats vs ON vs.player_id = p.id
  )
  SELECT
    username,
    hit_picks,
    total_picks,
    CASE
      WHEN total_picks > 0 THEN ROUND((hit_picks::numeric / total_picks) * 100, 2)
      ELSE 0
    END AS effectiveness,
    avg_odds_hit AS avg_odds,
    total_votes,
    ROUND(COALESCE(sum_odds_hit, 0) + COALESCE(total_picks, 0) - matchdays_count, 2) AS points
  FROM player_stats;
$function$
;

CREATE OR REPLACE FUNCTION public.get_player_ranking_by_season(season_id integer DEFAULT NULL::integer)
 RETURNS TABLE(username text, hit_picks integer, total_picks integer, effectiveness numeric, avg_odds numeric, total_votes integer, points numeric)
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
      ROUND(AVG(CASE WHEN pk.is_hit THEN pk.odds END), 2) AS avg_odds_hit,
      ROUND(SUM(CASE WHEN pk.is_hit THEN pk.odds ELSE 0 END), 2) AS sum_odds_hit
    FROM picks pk
    WHERE pk.season_id = (SELECT season_to_use FROM selected_season)
    GROUP BY pk.player_id
  ),
  season_matchdays_count AS (
    SELECT COUNT(*) AS matchdays_in_season
    FROM matchdays m
    WHERE m.season_id = (SELECT season_to_use FROM selected_season)
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
      ps.sum_odds_hit AS sum_odds_hit,
      COALESCE(vs.total_votes, 0) AS total_votes,
      (SELECT matchdays_in_season FROM season_matchdays_count) AS matchdays_count
    FROM players p
    LEFT JOIN picks_stats ps ON ps.player_id = p.id
    LEFT JOIN votes_stats vs ON vs.player_id = p.id
  )
  SELECT
    username,
    hit_picks,
    total_picks,
    CASE
      WHEN total_picks > 0 THEN ROUND((hit_picks::numeric / total_picks) * 100, 2)
      ELSE 0
    END AS effectiveness,
    avg_odds_hit AS avg_odds,
    total_votes,
    ROUND(COALESCE(sum_odds_hit, 0) + COALESCE(total_picks, 0) - matchdays_count, 2) AS points
  FROM player_stats;
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



