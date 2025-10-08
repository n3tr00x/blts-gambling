set check_function_bodies = off;

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


