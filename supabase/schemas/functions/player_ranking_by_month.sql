CREATE OR REPLACE FUNCTION player_ranking_by_month (month TEXT) RETURNS TABLE (
  "position" INTEGER,
  username TEXT,
  hit_picks INTEGER,
  total_picks INTEGER,
  effectiveness NUMERIC,
  avg_odds NUMERIC,
  total_votes INTEGER
) LANGUAGE sql AS $$
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
$$;
