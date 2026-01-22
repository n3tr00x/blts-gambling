set check_function_bodies = off;

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
cumulative_stats AS (
    SELECT 
        prs.username,
        prs.round_number,
        SUM(prs.hit_picks) OVER (PARTITION BY prs.username ORDER BY prs.round_number) AS cumulative_hits,
        SUM(prs.total_picks) OVER (PARTITION BY prs.username ORDER BY prs.round_number) AS cumulative_total
    FROM player_round_stats prs
)
SELECT 
    c.round_number,
    jsonb_object_agg(c.username, ROUND((c.cumulative_hits::DECIMAL / NULLIF(c.cumulative_total, 0)) * 100, 2)) AS data
FROM cumulative_stats c
GROUP BY c.round_number
ORDER BY c.round_number;
$function$
;

CREATE OR REPLACE FUNCTION public.player_ranking_by_month(month text)
 RETURNS TABLE("position" integer, username text, hit_picks integer, total_picks integer, effectiveness numeric, avg_odds numeric, total_votes integer)
 LANGUAGE sql
AS $function$
    WITH month_data AS (
        SELECT 
            TO_DATE(month, 'MM-YYYY') AS month_start,
            (TO_DATE(month, 'MM-YYYY') + INTERVAL '1 month - 1 day')::DATE AS month_end
    ),
    player_stats AS (
        SELECT 
            p.id AS player_id,
            p.username,
            COUNT(pk.id) AS total_picks,
            SUM(CASE WHEN pk.is_hit THEN 1 ELSE 0 END) AS hit_picks,
         ROUND(AVG(CASE WHEN pk.is_hit THEN pk.odds END), 2) AS avg_odds_hit,
          COALESCE(SUM(pk.votes), 0) AS total_votes
        FROM players p
        LEFT JOIN picks pk 
            ON pk.player_id = p.id
        LEFT JOIN matchdays m
            ON pk.matchday_id = m.id
        WHERE 
            m.match_date BETWEEN 
                (SELECT month_start FROM month_data) 
                AND 
                (SELECT month_end FROM month_data)
        GROUP BY p.id, p.username
    )
    SELECT
        RANK() OVER (
            ORDER BY 
                CASE 
                    WHEN total_picks > 0 
                    THEN (hit_picks::decimal / total_picks)
                    ELSE 0 
                END DESC
        ) AS position,
        username,
        hit_picks,
        total_picks,
        CASE 
            WHEN total_picks > 0 
            THEN ROUND((hit_picks::decimal / total_picks) * 100, 2)
            ELSE 0 
        END AS effectiveness,
        avg_odds_hit AS avg_odds,
        total_votes
    FROM player_stats
    ORDER BY position;
$function$
;

CREATE OR REPLACE FUNCTION public.player_ranking_by_season(season_id integer DEFAULT NULL::integer)
 RETURNS TABLE("position" integer, username text, hit_picks integer, total_picks integer, effectiveness numeric, avg_odds numeric, total_votes integer)
 LANGUAGE sql
AS $function$
    WITH selected_season AS (
        SELECT COALESCE(
            season_id, 
            (SELECT id FROM seasons ORDER BY start_date DESC LIMIT 1)
        ) AS season_to_use
    ),
    player_stats AS (
        SELECT 
            p.id AS player_id,
            p.username,
            COUNT(pk.id) AS total_picks,
            SUM(CASE WHEN pk.is_hit THEN 1 ELSE 0 END) AS hit_picks,
            ROUND(AVG(CASE WHEN pk.is_hit THEN pk.odds END), 2) AS avg_odds_hit,
             COALESCE(SUM(pk.votes), 0) AS total_votes
        FROM players p
        LEFT JOIN picks pk 
            ON pk.player_id = p.id
            AND pk.season_id = (SELECT season_to_use FROM selected_season)
        GROUP BY p.id, p.username
    )
    SELECT
        RANK() OVER (
            ORDER BY 
                CASE 
                    WHEN total_picks > 0 
                    THEN (hit_picks::decimal / total_picks)
                    ELSE 0 
                END DESC
        ) AS position,
        username,
        hit_picks,
        total_picks,
        CASE 
            WHEN total_picks > 0 
            THEN ROUND((hit_picks::decimal / total_picks) * 100, 2)
            ELSE 0 
        END AS effectiveness,
        avg_odds_hit AS avg_odds,
        total_votes
    FROM player_stats
    ORDER BY position;
$function$
;


