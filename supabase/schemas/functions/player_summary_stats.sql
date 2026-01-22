create    or replace function player_stats_by_season (season_id INTEGER default null) RETURNS table (
username TEXT,
total_picks INTEGER,
hit_count INTEGER,
avg_odds NUMERIC
) LANGUAGE sql as $$
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
$$;
