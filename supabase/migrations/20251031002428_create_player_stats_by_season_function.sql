set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.player_stats_by_season(season_id integer DEFAULT NULL::integer)
 RETURNS TABLE(username text, total_picks integer, hit_count integer, avg_odds numeric)
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
)
SELECT 
    pl.username,
    COUNT(p.id) AS total_picks,
    COUNT(*) FILTER (WHERE p.is_hit) AS hit_count,
    ROUND(AVG(p.odds)::numeric, 2) AS avg_odds
FROM players pl
JOIN picks p ON p.player_id = pl.id
JOIN matchdays m ON p.matchday_id = m.id
WHERE m.season_id = (SELECT id FROM active_season)
GROUP BY pl.username
ORDER BY total_picks DESC;
$function$
;


