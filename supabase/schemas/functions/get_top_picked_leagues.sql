CREATE OR REPLACE FUNCTION get_top_picked_leagues (season_id INT DEFAULT NULL) RETURNS TABLE (
  league_name TEXT,
  country TEXT,
  level INTEGER,
  pick_count BIGINT,
  hit_count BIGINT,
  total_picks BIGINT
) LANGUAGE sql AS $$
  WITH selected_season AS (
    SELECT COALESCE(
      season_id,
      (SELECT id FROM seasons_with_current WHERE is_current = true LIMIT 1),
      (SELECT id FROM seasons ORDER BY start_date DESC LIMIT 1)
    ) AS season_to_use
  ),
  league_stats AS (
    SELECT
      l.id,
      l.name AS league_name,
      l.country,
      l.level,
      COUNT(p.id) AS pick_count,
      COUNT(*) FILTER (
        WHERE
          p.is_hit = TRUE
      ) AS hit_count
    FROM
      leagues l
      LEFT JOIN picks p ON p.league_id = l.id
        AND p.season_id = (SELECT season_to_use FROM selected_season)
    GROUP BY
      l.id,
      l.name,
      l.country,
      l.level
  ),
  total AS (
    SELECT
      SUM(pick_count) AS total_picks
    FROM
      league_stats
  )
  SELECT
    ls.league_name,
    ls.country,
    ls.level,
    ls.pick_count,
    ls.hit_count,
    t.total_picks
  FROM
    league_stats ls
    CROSS JOIN total t
  WHERE
    ls.pick_count > 0
  ORDER BY
    ls.pick_count DESC;
$$;
