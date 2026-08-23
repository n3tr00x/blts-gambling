CREATE OR REPLACE FUNCTION players_effectiveness_progress (season_id INTEGER DEFAULT NULL) RETURNS TABLE (round_number INTEGER, data JSONB) LANGUAGE sql AS $$
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
$$;
