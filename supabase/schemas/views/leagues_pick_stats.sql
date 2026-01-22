CREATE OR REPLACE VIEW league_pick_stats_view AS
WITH
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
