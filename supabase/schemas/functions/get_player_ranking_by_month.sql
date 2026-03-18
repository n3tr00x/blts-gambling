CREATE OR REPLACE FUNCTION get_player_ranking_by_month (MONTH TEXT) RETURNS TABLE (
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
      (TO_DATE(month, 'MM-YYYY') + INTERVAL '1 month - 1 day')::date AS month_end
  ),
  picks_stats AS (
    SELECT
      pk.player_id,
      COUNT(*) AS total_picks,
      SUM(CASE WHEN pk.is_hit THEN 1 ELSE 0 END) AS hit_picks,
      ROUND(AVG(CASE WHEN pk.is_hit THEN pk.odds END), 2) AS avg_odds_hit
    FROM picks pk
    JOIN matchdays m
      ON m.id = pk.matchday_id
    WHERE m.match_date BETWEEN (SELECT month_start FROM month_data)
                          AND (SELECT month_end   FROM month_data)
    GROUP BY pk.player_id
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
      COALESCE(vs.total_votes, 0) AS total_votes
    FROM players p
    LEFT JOIN picks_stats ps ON ps.player_id = p.id
    LEFT JOIN votes_stats vs ON vs.player_id = p.id
  )
  SELECT
    RANK() OVER (
      ORDER BY
        CASE
          WHEN total_picks > 0 THEN (hit_picks::numeric / total_picks)
          ELSE 0
        END DESC,
        hit_picks DESC,
        total_picks DESC,
        username ASC
    ) AS "position",
    username,
    hit_picks,
    total_picks,
    CASE
      WHEN total_picks > 0 THEN ROUND((hit_picks::numeric / total_picks) * 100, 2)
      ELSE 0
    END AS effectiveness,
    avg_odds_hit AS avg_odds,
    total_votes
  FROM player_stats
  ORDER BY "position", username;
$$;
